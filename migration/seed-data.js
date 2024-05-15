/* eslint-disable no-console */
import mongoose from 'mongoose';
import { Appliance, RecyclingInfo, RecyclingLocation, User } from '../models';
import connect from '../utils/connect';
import appliances from './appliances';
import recyclingInfo from './recycling-info';
import recyclingLocations from './recycling-locations';
import users from './users';

async function dropCollections() {
  try {
    const collections = await mongoose.connection.db
      .listCollections()
      .toArray();

    for (let collection of collections) {
      console.log(`Dropping collection ${collection.name}...`);
      await mongoose.connection.db.dropCollection(collection.name);
      console.log('✔️');
    }
  } catch (err) {
    console.error(err);
    throw new Error('Error! Unable to drop collections');
  }
}

async function seedDatabase() {
  await connect();
  await dropCollections();

  try {
    console.log('Inserting appliance data...');
    await Appliance.insertMany(appliances);
    console.log('✔️');

    console.log('Inserting recycling data...');
    await RecyclingInfo.insertMany(recyclingInfo);
    console.log('✔️');

    console.log('Inserting recycling location data...');
    await RecyclingLocation.insertMany(recyclingLocations);
    console.log('✔️');

    console.log('Inserting user data...');
    await User.insertMany(await users());
    console.log('✔️');

    console.log('Setting createdBy and updatedBy fields for recycling info...');
    const admin = await User.findOne({ role: 'admin' }).lean();
    await RecyclingInfo.updateMany(
      {},
      { $set: { createdBy: admin._id, updatedBy: admin._id } }
    );
    console.log('✔️');
  } catch (error) {
    console.error('Error seeding data:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();
