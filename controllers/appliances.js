import { getDistance } from 'geolib';
import { isEmpty } from 'lodash';
import OpenAI from 'openai';
import {
  Appliance,
  RecommendationStats,
  RecyclingLocation,
  User,
} from '../models';

const openai = new OpenAI();

// Add a new appliance
async function addAppliance(req, res) {
  try {
    // Create a new appliance
    const newAppliance = new Appliance(req.body);
    await newAppliance.save();

    // Add the appliance to the user's list of appliances
    await User.findByIdAndUpdate(req.user._id, {
      $push: { appliances: newAppliance._id },
    });

    // Send a response
    res.status(201).json(newAppliance);
  } catch (error) {
    res.status(400).json({ message: 'Error adding new appliance', error });
  }
}

// Delete an appliance
async function deleteAppliance(req, res) {
  const { id } = req.params;
  try {
    // Find the appliance by ID and delete it
    const appliance = await Appliance.findByIdAndDelete(id);
    if (!appliance) {
      return res.status(404).json({ message: 'Appliance not found' });
    }

    // Delete the appliance from the user's list of appliances
    await User.findByIdAndUpdate(req.user._id, { $pull: { appliances: id } });

    // Send a response
    res.status(200).json({ message: 'Appliance successfully deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting appliance', error });
  }
}

// Get a single appliance by ID
async function getApplianceById(req, res) {
  try {
    const { id } = req.params;
    const appliance = await Appliance.findById(id).lean();
    if (!appliance) {
      return res.status(404).json({ message: 'Appliance not found' });
    }
    res.status(200).json(appliance);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching the appliance', error });
  }
}

// Get all appliances
async function getAppliances(req, res) {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId).populate('appliances').lean();
    const appliances = user.appliances;

    res.status(200).json(appliances);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching appliances', error });
  }
}

async function getRecommendations(req, res) {
  try {
    const { coordinates, distance = 50 } = req.body;

    // Validate input
    if (
      !coordinates ||
      coordinates.length !== 2 ||
      !coordinates.every((coord) => typeof coord === 'number')
    ) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }
    if (typeof distance !== 'number' || distance <= 0) {
      return res.status(400).json({ message: 'Invalid distance' });
    }

    // Fetch user's appliances
    const user = await User.findById(req.user._id)
      .populate('appliances')
      .lean();
    const appliances = user.appliances;

    // Check if user has any appliances
    if (isEmpty(appliances)) {
      return res.status(200).json({ message: 'No appliances found' });
    }

    // Check if recommendations already exist
    const applianceData = appliances.map((appliance) => ({
      id: appliance._id,
      lastUpdated: appliance.updatedAt,
    }));
    const existingStats = await RecommendationStats.findOne({
      userId: req.user._id,
      appliances: { $all: applianceData },
      coordinates,
      distance,
    });

    if (existingStats) {
      res.status(200).json({
        statistics: {
          totalEnergyUsage: existingStats.energyUsage,
          totalCO2Emissions: existingStats.CO2Emissions,
        },
        recommendations: existingStats.filteredRecommendations,
      });
      return;
    }

    // Calculate energy and environmental impact
    const totalEnergyUsage = appliances.reduce(
      (total, appliance) => total + appliance.energyUsage,
      0
    );
    const totalCO2Emissions = appliances.reduce(
      (total, appliance) => total + appliance.CO2Emissions,
      0
    );

    // Convert distance from km to radians for MongoDB query
    const distanceInMeters = distance * 1000; // distance in meters

    // Find recycling centers within the specified distance
    const recyclingCenters = await RecyclingLocation.find({
      location: {
        $geoWithin: {
          $centerSphere: [
            [coordinates[1], coordinates[0]],
            distanceInMeters / 6378100,
          ],
        },
      },
    });

    const recyclingCenterDistances = recyclingCenters.map((center) => ({
      ...center.toObject(),
      distance: getDistance(coordinates, [
        center.location.coordinates[1],
        center.location.coordinates[0],
      ]),
    }));

    // Generate detailed prompt for OpenAI
    const prompt = `Utilizatorul deține următoarele electrocasnice:
${appliances
  .map(
    (appliance) => `
  - ${appliance.name}
    Descriere: ${appliance.description}
    An de producție: ${appliance.productionYear}
    Consum de energie: ${appliance.energyUsage} kWh/an
    Emisii CO2: ${appliance.CO2Emissions} kg/an
    Durată de viață așteptată: ${appliance.expectedLifespan} ani
    Opțiuni de eliminare: ${appliance.disposalOptions}
    Clasificare energetică: ${appliance.efficiencyRating}
    Compoziție materială: Metal: ${appliance.materialComposition.metal}%, Plastic: ${appliance.materialComposition.plastic}%, Altele: ${appliance.materialComposition.other}%
`
  )
  .join('\n')}
Consum total de energie: ${totalEnergyUsage} kWh/an
Emisii totale de CO2: ${totalCO2Emissions} kg/an
Centre de reciclare la o distanță de ${distance} km:
${recyclingCenterDistances
  .map(
    (center) => `
  - ${center.name}
    Adresă: ${center.address}
    Telefon: ${center.phone}
    Descriere: ${center.description}
    Companie: ${center.company}
    CUI: ${center.cui}
    RegCom: ${center.regCom}
    Program:
      Luni: ${center.schedule.monday || 'N/A'}
      Marți: ${center.schedule.tuesday || 'N/A'}
      Miercuri: ${center.schedule.wednesday || 'N/A'}
      Joi: ${center.schedule.thursday || 'N/A'}
      Vineri: ${center.schedule.friday || 'N/A'}
      Sâmbătă: ${center.schedule.saturday || 'N/A'}
      Duminică: ${center.schedule.sunday || 'N/A'}
    Distanță: ${center.distance} metri`
  )
  .join('\n')}

Te rog să furnizezi recomandări pentru îmbunătățirea eficienței energetice a utilizatorului la persoana a doua singular. Asigură-te că fiecare propoziție se termină cu un semn de punctuație.`;

    // Make request to OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'Ești un asistent util.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7, // Higher temperature means more randomness
      max_tokens: 256, // Maximum number of tokens to generate
    });

    const recommendations = completion.choices[0].message.content.trim();

    // Filter out any incomplete sentences
    const filteredRecommendations = recommendations
      .split('\n')
      .map((sentence) => {
        return sentence
          .replace(/^\s*\d+(\.\d+)*\s*[.-]?\s*/, '')
          .replace(/^\s*[-•]\s*/, '')
          .replace(/\s*[-•]\s*$/, '')
          .replace(/\s*\d+(\.\d+)*\s*$/, '')
          .trim();
      })
      .filter((sentence) => sentence.match(/[\w\d\s]+[.!?]$/));

    // Store statistics and recommendations
    const recommendationStatsData = {
      userId: req.user._id,
      energyUsage: totalEnergyUsage,
      CO2Emissions: totalCO2Emissions,
      recommendations,
      coordinates,
      distance,
      recyclingCenters: recyclingCenters.map((center) => center._id),
      recyclingCenterDistances: recyclingCenterDistances.map((center) => ({
        id: center._id,
        distance: center.distance,
      })),
      prompt,
      completion: JSON.stringify(completion),
      filteredRecommendations,
      energyEfficiencyRating: calculateEnergyEfficiencyRating(totalEnergyUsage), // Function to calculate energy efficiency rating
      CO2EmissionsRating: calculateCO2EmissionsRating(totalCO2Emissions), // Function to calculate CO2 emissions rating
      appliances: appliances.map((appliance) => ({
        id: appliance._id,
        lastUpdated: appliance.updatedAt,
      })),
    };

    const recommendationStats = new RecommendationStats(
      recommendationStatsData
    );
    await recommendationStats.save();

    res.status(200).json({
      statistics: {
        totalEnergyUsage,
        totalCO2Emissions,
      },
      recommendations: filteredRecommendations,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error });
  }
}

function calculateEnergyEfficiencyRating(totalEnergyUsage) {
  if (totalEnergyUsage < 100) {
    return 'A+++';
  } else if (totalEnergyUsage < 150) {
    return 'A++';
  } else if (totalEnergyUsage < 200) {
    return 'A+';
  } else if (totalEnergyUsage < 250) {
    return 'A';
  } else if (totalEnergyUsage < 300) {
    return 'B';
  } else if (totalEnergyUsage < 400) {
    return 'C';
  } else if (totalEnergyUsage < 500) {
    return 'D';
  } else if (totalEnergyUsage < 600) {
    return 'E';
  } else if (totalEnergyUsage < 700) {
    return 'F';
  } else {
    return 'G';
  }
}

function calculateCO2EmissionsRating(totalCO2Emissions) {
  if (totalCO2Emissions < 1000) {
    return 'A';
  } else if (totalCO2Emissions < 2000) {
    return 'B';
  } else if (totalCO2Emissions < 3000) {
    return 'C';
  } else if (totalCO2Emissions < 4000) {
    return 'D';
  } else if (totalCO2Emissions < 5000) {
    return 'E';
  } else if (totalCO2Emissions < 6000) {
    return 'F';
  } else {
    return 'G';
  }
}

// Update an existing appliance
async function updateAppliance(req, res) {
  const { id } = req.params;
  try {
    const appliance = await Appliance.findByIdAndUpdate(id, req.body, {
      new: true,
    });
    if (!appliance) {
      return res.status(404).json({ message: 'Appliance not found' });
    }
    res.status(200).json(appliance);
  } catch (error) {
    res.status(400).json({ message: 'Error updating appliance', error });
  }
}

export default {
  addAppliance,
  deleteAppliance,
  getApplianceById,
  getAppliances,
  getRecommendations,
  updateAppliance,
};
