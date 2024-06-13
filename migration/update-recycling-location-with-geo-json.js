/* eslint-disable no-console */
import mongoose from 'mongoose';
import { RecyclingLocation } from '../models';
import connect from '../utils/connect';

async function updateRecyclingLocationWithGeoJSON() {
  const locations = await RecyclingLocation.find().lean();
  for (let location of locations) {
    const updatedLocation = {
      type: 'Point',
      coordinates: [location.longitude, location.latitude],
    };
    await RecyclingLocation.findByIdAndUpdate(location._id, {
      $set: { location: updatedLocation },
    });
    console.log(`Updated location for RecyclingLocation ID ${location._id}`);
  }
}

async function migrateData() {
  await connect();

  try {
    console.log('Updating recycling locations with GeoJSON location...');
    await updateRecyclingLocationWithGeoJSON();
    console.log('✔️');
  } catch (error) {
    console.error('Error updating recycling locations:', error);
  } finally {
    mongoose.disconnect();
  }
}

migrateData();
