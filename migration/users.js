import bcrypt from 'bcrypt';
import { Appliance, RecyclingLocation } from '../models';

export default async function () {
  const appliances = await Appliance.find().select('_id').lean();
  const recyclingLocations = await RecyclingLocation.find()
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
      email: 'user@example.com',
      firstName: 'Ion',
      lastName: 'Ionescu',
      password: await bcrypt.hash('Parola123!', 10),
      phone: '0712345678',
      appliances: appliances.map((appliance) => appliance._id),
      energyUsage: appliances.map((appliance) => ({
        applianceId: appliance._id,
        timestamp: new Date(),
        usage: Math.floor(Math.random() * 100),
      })),
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
      email: 'manager.reciclare@example.com',
      firstName: 'George',
      lastName: 'Vasilescu',
      password: await bcrypt.hash('Parola123!', 10),
      role: 'recycling_manager',
      recyclingLocations: recyclingLocations.map((location) => location._id),
    },
  ];
}
