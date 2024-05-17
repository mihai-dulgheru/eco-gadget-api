import bcrypt from 'bcrypt';
import { Schema, model } from 'mongoose';
import validator from 'validator';

const energyUsageSchema = new Schema({
  applianceId: { type: Schema.Types.ObjectId, ref: 'Appliance' },
  timestamp: { type: Date, default: Date.now },
  usage: { type: Number },
});

const schema = new Schema(
  {
    aiSettings: {
      notificationsEnabled: { type: Boolean, default: true },
      optimizationPreferences: {
        type: String,
        enum: ['energy-saving', 'performance', 'balanced'],
        default: 'balanced',
      },
    },
    appliances: [{ type: Schema.Types.ObjectId, ref: 'Appliance' }],
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
      validate: {
        validator: (value) => validator.isEmail(value),
        message: (props) => `${props.value} is not a valid email!`,
      },
    },
    energyUsage: [energyUsageSchema],
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    lifecycleAnalysis: {
      totalCO2Emissions: { type: Number, default: 0 },
      suggestions: [{ type: String }],
    },
    password: {
      type: String,
      required: true,
      minLength: 8,
      validate: {
        validator: function (value) {
          return /^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[\W]).{8,}$/.test(value);
        },
        message: () =>
          'Password must contain at least one number, one lowercase and one uppercase letter, and one special character.',
      },
    },
    phone: {
      type: String,
      trim: true,
      validate: {
        validator: (value) => validator.isMobilePhone(value),
        message: (props) => `${props.value} is not a valid phone number!`,
      },
    },
    profilePicture: {
      name: { type: String },
      size: { type: Number },
      type: { type: String },
      url: { type: String },
    },
    recyclingLocations: [
      { type: Schema.Types.ObjectId, ref: 'RecyclingLocation' },
    ],
    role: {
      type: String,
      enum: ['admin', 'user', 'recycling_manager'],
      default: 'user',
    },
  },
  { timestamps: true }
);

schema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

const User = model('User', schema);

export default User;
