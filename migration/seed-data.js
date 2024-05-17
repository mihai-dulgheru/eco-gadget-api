/* eslint-disable no-console */
import mongoose from 'mongoose';
import {
  Appliance,
  Message,
  RecyclingInfo,
  RecyclingLocation,
  User,
} from '../models';
import connect from '../utils/connect';
import appliances from './appliances';
import messages from './messages';
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

async function updateRecyclingLocationWithMessagesId() {
  const message = await Message.findOne().select('_id').lean();
  const messageId = message._id;
  await RecyclingLocation.updateMany({}, { $set: { messages: [messageId] } });
}

async function updateRecyclingInfoAdminFields() {
  const admin = await User.findOne({ role: 'admin' }).lean();
  await RecyclingInfo.updateMany(
    {},
    { $set: { createdBy: admin._id, updatedBy: admin._id } }
  );
}

async function seedDatabase() {
  await connect();
  await dropCollections();

  try {
    console.log('Inserting appliance data...');
    await Appliance.insertMany(await appliances());
    console.log('✔️');

    console.log('Inserting recycling data...');
    await RecyclingInfo.insertMany(await recyclingInfo());
    console.log('✔️');

    console.log('Inserting recycling location data...');
    await RecyclingLocation.insertMany(await recyclingLocations());
    console.log('✔️');

    console.log('Inserting messages data...');
    await Message.insertMany(await messages());
    console.log('✔️');

    console.log('Updating recycling location data with messages id...');
    await updateRecyclingLocationWithMessagesId();
    console.log('✔️');

    console.log('Inserting user data...');
    await User.insertMany(await users());
    console.log('✔️');

    console.log('Setting createdBy and updatedBy fields for recycling info...');
    await updateRecyclingInfoAdminFields();
    console.log('✔️');
  } catch (error) {
    console.error('Error seeding data:', error.message);
  } finally {
    mongoose.disconnect();
  }
}

seedDatabase();
