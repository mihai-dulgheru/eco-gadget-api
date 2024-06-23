import { Schema, model } from 'mongoose';

const recommendationStatsSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  energyUsage: { type: Number, required: true },
  CO2Emissions: { type: Number, required: true },
  recommendations: { type: String, required: true },
  location: {
    type: { type: String, default: 'Point' },
    coordinates: { type: [Number], required: true },
  },
  recyclingCenters: {
    type: [
      new Schema(
        {
          id: { type: Schema.Types.ObjectId, ref: 'RecyclingLocation' },
          distance: Number,
        },
        { _id: false }
      ),
    ],
    required: true,
  },
  prompt: { type: String, required: true },
  completion: { type: String, required: true },
  filteredRecommendations: { type: [String], required: true },
  energyEfficiencyRating: { type: String, required: true },
  CO2EmissionsRating: { type: String, required: true },
  appliances: [
    new Schema(
      {
        id: { type: Schema.Types.ObjectId, ref: 'Appliance' },
        lastUpdated: { type: Date, required: true },
      },
      { _id: false }
    ),
  ],
  recyclingDonationSwap: {
    type: new Schema(
      {
        type: { type: String, enum: ['donation', 'recycling', 'swap'] },
        recyclingCenter: {
          type: Schema.Types.ObjectId,
          ref: 'RecyclingLocation',
        },
        appliance: { type: Schema.Types.ObjectId, ref: 'Appliance' },
        recommendation: { type: String, required: true },
      },
      { _id: false }
    ),
  },
});

recommendationStatsSchema.index({ location: '2dsphere' });

const RecommendationStats = model(
  'RecommendationStats',
  recommendationStatsSchema
);

export default RecommendationStats;
