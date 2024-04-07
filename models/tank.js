import mongoose from 'mongoose';

const schema = new mongoose.Schema({ name: String, size: String });
const Tank = mongoose.model('Tank', schema);

export default Tank;
