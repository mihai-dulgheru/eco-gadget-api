export default async function () {
  return [
    {
      name: 'Refrigerator',
      description: 'Energy-efficient fridge',
      productionYear: 2018,
      energyUsage: 300,
      CO2Emissions: 150,
      expectedLifespan: 10,
      disposalOptions: 'Recyclable',
      efficiencyRating: 'A++',
      materialComposition: {
        metal: 60,
        plastic: 30,
        other: 10,
      },
    },
    {
      name: 'Microwave',
      description: 'Compact microwave oven',
      productionYear: 2019,
      energyUsage: 250,
      CO2Emissions: 100,
      expectedLifespan: 8,
      disposalOptions: 'Recyclable',
      efficiencyRating: 'A',
      materialComposition: {
        metal: 50,
        plastic: 45,
        other: 5,
      },
    },
  ];
}
