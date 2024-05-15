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
      firstName: 'John',
      lastName: 'Doe',
      password: await bcrypt.hash('Password123!', 10),
      role: 'admin',
    },
    {
      email: 'user1@example.com',
      firstName: 'John',
      lastName: 'Smith',
      password: await bcrypt.hash('Password123!', 10),
      phone: '+40712345678',
      appliances: [appliances[0]._id],
      energyUsage: [
        {
          applianceId: appliances[0]._id,
          timestamp: new Date(),
          usage: 150,
        },
      ],
      recyclingLocations: [recyclingLocations[0]._id],
      lifecycleAnalysis: {
        totalCO2Emissions: 250,
        suggestions: [
          'Consider upgrading your refrigerator for better efficiency.',
        ],
      },
      aiSettings: {
        notificationsEnabled: true,
        optimizationPreferences: 'energy-saving',
      },
    },
    {
      email: 'user2@example.com',
      firstName: 'Jane',
      lastName: 'Doe',
      password: await bcrypt.hash('Password123!', 10),
      phone: '+40789456123',
      appliances: [appliances[1]._id],
      energyUsage: [
        {
          applianceId: appliances[1]._id,
          timestamp: new Date(),
          usage: 200,
        },
      ],
      recyclingLocations: [recyclingLocations[0]._id],
      lifecycleAnalysis: {
        totalCO2Emissions: 150,
        suggestions: [
          'Consider recycling your microwave for better sustainability.',
        ],
      },
      aiSettings: {
        notificationsEnabled: true,
        optimizationPreferences: 'performance',
      },
    },
  ];
}
