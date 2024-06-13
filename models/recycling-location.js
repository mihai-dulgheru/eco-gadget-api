import { Schema, model } from 'mongoose';

const scheduleSchema = new Schema({
  monday: String,
  tuesday: String,
  wednesday: String,
  thursday: String,
  friday: String,
  saturday: String,
  sunday: String,
});

const recyclingLocationSchema = new Schema(
  {
    name: { type: String, required: true },
    address: { type: String, required: true },
    image: { type: String, required: true },
    phone: { type: String, required: true },
    description: { type: String, required: true },
    schedule: scheduleSchema,
    company: { type: String, required: true },
    cui: { type: String, required: true },
    regCom: { type: String, required: true },
    location: {
      type: { type: String, default: 'Point' },
      coordinates: { type: [Number], required: true },
    },
    messages: [{ type: Schema.Types.ObjectId, ref: 'Message' }],
  },
  {
    timestamps: true,
  }
);

recyclingLocationSchema.index({ location: '2dsphere' });

const RecyclingLocation = model('RecyclingLocation', recyclingLocationSchema);

export default RecyclingLocation;
