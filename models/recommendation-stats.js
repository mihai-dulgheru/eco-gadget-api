import { Schema, model } from 'mongoose';

const recommendationSchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  timestamp: { type: Date, default: Date.now },
  energyUsage: { type: Number, required: true },
  CO2Emissions: { type: Number, required: true },
  recommendations: { type: String, required: true },
  coordinates: { type: [Number], required: true },
  distance: { type: Number, required: true },
  recyclingCenters: [{ type: Schema.Types.ObjectId, ref: 'RecyclingLocation' }],
  recyclingCenterDistances: {
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
});

const RecommendationStats = model('RecommendationStats', recommendationSchema);

export default RecommendationStats;
