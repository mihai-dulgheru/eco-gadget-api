import { DISPOSAL_OPTIONS, EFFICIENCY_RATINGS } from '../models/appliance';

export default async function () {
  return [
    {
      name: 'Frigider',
      description: 'Frigider eficient energetic',
      productionYear: 2020,
      energyUsage: 250,
      CO2Emissions: 120,
      expectedLifespan: 12,
      disposalOptions: DISPOSAL_OPTIONS[0],
      efficiencyRating: EFFICIENCY_RATINGS[1],
      materialComposition: {
        metal: 70,
        plastic: 25,
        other: 5,
      },
    },
    {
      name: 'Cuptor cu microunde',
      description: 'Cuptor cu microunde compact',
      productionYear: 2021,
      energyUsage: 200,
      CO2Emissions: 90,
      expectedLifespan: 10,
      disposalOptions: DISPOSAL_OPTIONS[0],
      efficiencyRating: EFFICIENCY_RATINGS[3],
      materialComposition: {
        metal: 55,
        plastic: 40,
        other: 5,
      },
    },
  ];
}
