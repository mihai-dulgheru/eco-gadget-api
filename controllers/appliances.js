import { isEmpty } from 'lodash';
import OpenAI from 'openai';
import {
  Appliance,
  RecommendationStats,
  RecyclingLocation,
  User,
} from '../models';

const EARTH_S_RADIUS_IN_METERS = 6_378_100;
const RECOMMENDATION_RADIUS_METERS = EARTH_S_RADIUS_IN_METERS / 100_000; // 63.781 meters
const RECYCLING_CENTER_RADIUS_METERS = EARTH_S_RADIUS_IN_METERS / 1_000; // 6.3781 kilometers

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

// Function to extract JSON from the chat response
function extractJSON(response) {
  // Use a regular expression to find the JSON block
  const jsonMatch = response.match(/\{([\s\S]*?)\}/);
  if (jsonMatch && jsonMatch[1]) {
    try {
      // Add curly braces to the JSON string
      const jsonString = `{${jsonMatch[1].trim()}}`;
      return JSON.parse(jsonString.trim());
    } catch (error) {
      console.error('Error parsing JSON:', error);
    }
  }
  return null;
}

async function getRecommendations(req, res) {
  try {
    const { coordinates } = req.body; // Coordinates in [longitude, latitude] format

    // Validate input coordinates
    if (
      !coordinates ||
      coordinates.length !== 2 ||
      !coordinates.every((coord) => typeof coord === 'number')
    ) {
      return res.status(400).json({ message: 'Invalid coordinates' });
    }

    // Fetch user's appliances
    const user = await User.findById(req.user._id)
      .populate('appliances')
      .lean();
    const { aiSettings, appliances } = user;

    // Calculate total energy usage and CO2 emissions
    const totalEnergyUsage = appliances.reduce(
      (total, appliance) => total + appliance.energyUsage,
      0
    );
    const totalCO2Emissions = appliances.reduce(
      (total, appliance) => total + appliance.CO2Emissions,
      0
    );

    // Check if AI notifications are disabled
    if (!aiSettings.notificationsEnabled) {
      return res.status(200).json({
        aiNotificationsEnabled: false,
        recommendations: [],
        recyclingDonationSwap: null,
        statistics: { totalCO2Emissions, totalEnergyUsage },
      });
    }

    // Check if user has any appliances
    if (isEmpty(appliances)) {
      return res.status(200).json({
        aiNotificationsEnabled: true,
        recommendations: [],
        recyclingDonationSwap: null,
        statistics: { totalCO2Emissions, totalEnergyUsage },
      });
    }

    const applianceData = appliances.map((appliance) => ({
      id: appliance._id,
      lastUpdated: appliance.updatedAt,
    }));

    // Check if recommendations already exist within a specified radius
    const existingStats = await RecommendationStats.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: coordinates },
          distanceField: 'distance',
          maxDistance: RECOMMENDATION_RADIUS_METERS,
          spherical: true,
          distanceMultiplier: 1, // Convert to meters
        },
      },
      { $match: { userId: req.user._id, appliances: { $all: applianceData } } },
      { $sort: { distance: 1 } },
      {
        $lookup: {
          from: 'recyclinglocations',
          localField: 'recyclingDonationSwap.recyclingCenter',
          foreignField: '_id',
          as: 'recyclingCenterDetails',
        },
      },
      {
        $lookup: {
          from: 'appliances',
          localField: 'recyclingDonationSwap.appliance',
          foreignField: '_id',
          as: 'applianceDetails',
        },
      },
      {
        $addFields: {
          'recyclingDonationSwap.recyclingCenter': {
            $arrayElemAt: ['$recyclingCenterDetails', 0],
          },
          'recyclingDonationSwap.appliance': {
            $arrayElemAt: ['$applianceDetails', 0],
          },
        },
      },
      { $project: { recyclingCenterDetails: 0, applianceDetails: 0 } },
    ]);

    // If existing recommendations are found, return the closest one
    if (existingStats && existingStats.length > 0) {
      const bestMatch = existingStats[0];
      return res.status(200).json({
        aiNotificationsEnabled: true,
        recommendations: bestMatch.filteredRecommendations,
        recyclingDonationSwap: bestMatch.recyclingDonationSwap,
        statistics: {
          totalCO2Emissions: bestMatch.CO2Emissions,
          totalEnergyUsage: bestMatch.energyUsage,
        },
      });
    }

    // Find recycling centers within the specified radius
    const recyclingCenters = await RecyclingLocation.aggregate([
      {
        $geoNear: {
          near: { type: 'Point', coordinates: coordinates },
          distanceField: 'distance',
          maxDistance: RECYCLING_CENTER_RADIUS_METERS,
          spherical: true,
          distanceMultiplier: 1, // Convert to meters
        },
      },
      { $sort: { distance: 1 } },
    ]);

    // Generate detailed prompt for OpenAI
    const prompt = `Utilizatorul deține următoarele electrocasnice:
${appliances
  .map(
    (appliance) => `
  - ${appliance.name}
    ID: ${appliance._id}
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
Centre de reciclare la o distanță de ${RECYCLING_CENTER_RADIUS_METERS} metri:
${recyclingCenters
  .map(
    (center) => `
  - ${center.name}
    ID: ${center._id}
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

Te rog să furnizezi recomandări pentru îmbunătățirea eficienței energetice folosind persoana a doua singular. Prima linie a răspunsului trebuie să conțină o recomandare de reciclare, donație sau schimb sub formă de JSON, urmată de recomandări pentru eficiența energetică. Asigură-te că fiecare propoziție se termină cu un semn de punctuație și furnizează o singură recomandare pentru reciclare, donație sau schimb, reprezentând cea mai bună opțiune pentru utilizator.
JSON-ul trebuie să aibă următoarea structură:
\`\`\`json
{
  type: "<donation/recycling/swap>",
  recyclingCenter: "<ID_recycling_center>",
  appliance: "<ID_appliance>",
  recommendation: "<Recommendation>"
}
\`\`\`
`;

    // Make request to OpenAI
    const completion = await openai.chat.completions.create({
      messages: [
        { role: 'system', content: 'Ești un asistent util.' },
        { role: 'user', content: prompt },
      ],
      model: 'gpt-3.5-turbo',
      temperature: 0.7, // Higher temperature means more randomness
      // max_tokens: 256, // Maximum number of tokens to generate
      max_tokens: 512, // Maximum number of tokens to generate
    });

    // Extract recommendations from OpenAI response
    const recommendations = completion.choices[0].message.content.trim();

    // Prepare data for RecommendationStats
    const recommendationStatsData = {
      userId: req.user._id,
      energyUsage: totalEnergyUsage,
      CO2Emissions: totalCO2Emissions,
      recommendations,
      location: { type: 'Point', coordinates },
      recyclingCenters: recyclingCenters.map((center) => ({
        id: center._id,
        distance: center.distance,
      })),
      prompt,
      completion: JSON.stringify(completion),
      energyEfficiencyRating: calculateEnergyEfficiencyRating(totalEnergyUsage),
      CO2EmissionsRating: calculateCO2EmissionsRating(totalCO2Emissions),
      appliances: appliances.map((appliance) => ({
        id: appliance._id,
        lastUpdated: appliance.updatedAt,
      })),
    };

    // Extract JSON for recycling/donation/swap from recommendations
    const recyclingDonationSwap = extractJSON(recommendations);

    if (recyclingDonationSwap) {
      const {
        type,
        recyclingCenter: recyclingCenterId,
        appliance: applianceId,
        recommendation,
      } = recyclingDonationSwap;

      // Find the recycling center and appliance by their IDs
      const recyclingCenter =
        await RecyclingLocation.findById(recyclingCenterId).lean();
      const appliance = await Appliance.findById(applianceId).lean();

      // If both are found, add detailed info to recyclingDonationSwap and update recommendationStatsData
      if (recyclingCenter && appliance) {
        recyclingDonationSwap.recyclingCenter = recyclingCenter;
        recyclingDonationSwap.appliance = appliance;
        recommendationStatsData.recyclingDonationSwap = {
          type,
          recyclingCenter: recyclingCenter._id,
          appliance: appliance._id,
          recommendation,
        };
      }
    }

    // Filter out any incomplete sentences from recommendations
    const filteredRecommendations = recommendations
      .split('\n')
      .map(
        (sentence) =>
          sentence
            .replace(/^\s*\d+(\.\d+)*\s*[.-]?\s*/, '') // Remove leading numbers and punctuation
            .replace(/^\s*[-•]\s*/, '') // Remove leading bullet points
            .replace(/\s*[-•]\s*$/, '') // Remove trailing bullet points
            .replace(/\s*\d+(\.\d+)*\s*$/, '') // Remove trailing numbers
            .trim() // Trim whitespace
      )
      .filter((sentence) => sentence.match(/[\w\d\s]+[.!?]$/)); // Keep sentences ending with punctuation

    // Add filtered recommendations to recommendationStatsData
    recommendationStatsData.filteredRecommendations = filteredRecommendations;

    // Create a new RecommendationStats document and save it
    const recommendationStats = new RecommendationStats(
      recommendationStatsData
    );
    await recommendationStats.save();

    // Send response to client
    res.status(200).json({
      aiNotificationsEnabled: true,
      recommendations: filteredRecommendations,
      recyclingDonationSwap,
      statistics: { totalCO2Emissions, totalEnergyUsage },
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recommendations', error });
  }
}

// Function to calculate energy efficiency rating
function calculateEnergyEfficiencyRating(totalEnergyUsage) {
  if (totalEnergyUsage < 100) return 'A+++';
  else if (totalEnergyUsage < 150) return 'A++';
  else if (totalEnergyUsage < 200) return 'A+';
  else if (totalEnergyUsage < 250) return 'A';
  else if (totalEnergyUsage < 300) return 'B';
  else if (totalEnergyUsage < 400) return 'C';
  else if (totalEnergyUsage < 500) return 'D';
  else if (totalEnergyUsage < 600) return 'E';
  else if (totalEnergyUsage < 700) return 'F';
  else return 'G';
}

// Function to calculate CO2 emissions rating
function calculateCO2EmissionsRating(totalCO2Emissions) {
  if (totalCO2Emissions < 1000) return 'A';
  else if (totalCO2Emissions < 2000) return 'B';
  else if (totalCO2Emissions < 3000) return 'C';
  else if (totalCO2Emissions < 4000) return 'D';
  else if (totalCO2Emissions < 5000) return 'E';
  else if (totalCO2Emissions < 6000) return 'F';
  else return 'G';
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
