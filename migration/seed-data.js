/* eslint-disable no-console */
import mongoose from 'mongoose';
import { Appliance, RecyclingInfo, RecyclingLocation, User } from '../models';
import connect from '../utils/connect';
import appliances from './appliances';
import recyclingInfo from './recycling-info';
import recyclingLocations from './recycling-locations';
import users from './users';

async function seedDatabase() {
  await connect();

  try {
    console.log('Seeding data...');

    console.log('Deleting existing appliance data...');
    await Appliance.deleteMany({});
    console.log('Inserting appliance data...');
    await Appliance.insertMany(appliances);
    console.log('Appliance data successfully seeded!');

    console.log('Deleting existing recycling data...');
    await RecyclingInfo.deleteMany({});
    console.log('Inserting recycling data...');
    await RecyclingInfo.insertMany(recyclingInfo);
    console.log('Recycling data successfully seeded!');

    console.log('Deleting existing recycling location data...');
    await RecyclingLocation.deleteMany({});
    console.log('Inserting recycling location data...');
    await RecyclingLocation.insertMany(recyclingLocations);
    console.log('Recycling location data successfully seeded!');

    console.log('Deleting existing user data...');
    await User.deleteMany({});
    console.log('Inserting user data...');
    await User.insertMany(await users());
    console.log('User data successfully seeded!');

    console.log('Setting createdBy and updatedBy fields for recycling info...');
    const admin = await User.findOne({ role: 'admin' });
    await RecyclingInfo.updateMany(
      {},
      { $set: { createdBy: admin._id, updatedBy: admin._id } }
    );
    console.log(
      'createdBy and updatedBy fields successfully set for recycling info!'
    );

    console.log('Data successfully seeded!');
  } catch (error) {
    console.error('Error seeding data:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();
