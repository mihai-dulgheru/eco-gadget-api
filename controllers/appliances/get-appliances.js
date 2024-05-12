const getAppliances = async (_req, res) => {
  return res.json({
    data: [
      {
        _id: 1,
        name: 'Refrigerator',
        description: 'Energy-efficient fridge',
        productionYear: 2018,
        energyUsage: 300, // kWh per year
        CO2Emissions: 150, // kg of CO2 per year
        expectedLifespan: 10, // years
        disposalOptions: 'Recyclable',
        efficiencyRating: 'A++',
        materialComposition: {
          metal: 60, // percentage
          plastic: 30, // percentage
          other: 10, // percentage
        },
        createdAt: new Date(),
        createdBy: 'Admin',
        updatedAt: new Date(),
        updatedBy: 'Admin',
      },
      {
        _id: 2,
        name: 'Microwave',
        description: 'Compact microwave oven',
        productionYear: 2019,
        energyUsage: 250, // kWh per year
        CO2Emissions: 100, // kg of CO2 per year
        expectedLifespan: 8, // years
        disposalOptions: 'Recyclable',
        efficiencyRating: 'A',
        materialComposition: {
          metal: 50,
          plastic: 45,
          other: 5,
        },
        createdAt: new Date(),
        createdBy: 'Admin',
        updatedAt: new Date(),
        updatedBy: 'Admin',
      },
    ],
  });
};

export default getAppliances;
