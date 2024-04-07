import 'dotenv/config';
import mongoose from 'mongoose';

let connection;

const connect = async () => {
  if (!connection) {
    connection = await mongoose.connect(process.env.MONGODB_CONNECTION_STRING, {
      serverSelectionTimeoutMS: 5000,
    });
  }

  return connection;
};

export default connect;
