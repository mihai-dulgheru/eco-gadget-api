import bcrypt from 'bcrypt';
import { Appliance, RecyclingLocation } from '../models';

export default async function () {
  const appliances = await Appliance.find({}).select('_id').lean();
  const recyclingLocations = await RecyclingLocation.find({})
    .select('_id')
    .lean();

  return [
    {
      email: 'admin@example.com',
      firstName: 'Ana',
      lastName: 'Popescu',
      password: await bcrypt.hash('Parola123!', 10),
      role: 'admin',
    },
    {
      email: 'user1@example.com',
      firstName: 'Ion',
      lastName: 'Ionescu',
      password: await bcrypt.hash('Parola123!', 10),
      phone: '+40712345678',
      appliances: [appliances[0]._id],
      energyUsage: [
        {
          applianceId: appliances[0]._id,
          timestamp: new Date(),
          usage: 100,
        },
      ],
      lifecycleAnalysis: {
        totalCO2Emissions: 200,
        suggestions: [
          'Considerați înlocuirea frigiderului pentru o eficiență mai bună.',
        ],
      },
      aiSettings: {
        notificationsEnabled: true,
        optimizationPreferences: 'energy-saving',
      },
    },
    {
      email: 'user2@example.com',
      firstName: 'Maria',
      lastName: 'Popa',
      password: await bcrypt.hash('Parola123!', 10),
      phone: '+40789456123',
      appliances: [appliances[1]._id],
      energyUsage: [
        {
          applianceId: appliances[1]._id,
          timestamp: new Date(),
          usage: 180,
        },
      ],
      lifecycleAnalysis: {
        totalCO2Emissions: 150,
        suggestions: [
          'Considerați reciclarea cuptorului cu microunde pentru o sustenabilitate mai bună.',
        ],
      },
      aiSettings: {
        notificationsEnabled: true,
        optimizationPreferences: 'performance',
      },
    },
    {
      email: 'manager.reciclare@example.com',
      firstName: 'George',
      lastName: 'Vasilescu',
      password: await bcrypt.hash('Parola123!', 10),
      role: 'recycling_manager',
      recyclingLocations: [recyclingLocations[0]._id],
    },
  ];
}
