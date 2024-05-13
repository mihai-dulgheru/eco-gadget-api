import { Schema, model } from 'mongoose';

const materialCompositionSchema = new Schema({
  metal: { type: Number, required: true },
  plastic: { type: Number, required: true },
  other: { type: Number, required: true },
});

export const applianceSchema = new Schema(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    productionYear: { type: Number, required: true },
    energyUsage: { type: Number, required: true }, // kWh per year
    CO2Emissions: { type: Number, required: true }, // kg of CO2 per year
    expectedLifespan: { type: Number, required: true }, // years
    disposalOptions: { type: String, required: true },
    efficiencyRating: { type: String, required: true },
    materialComposition: materialCompositionSchema,
  },
  {
    timestamps: true,
  }
);

const Appliance = model('Appliance', applianceSchema);

export default Appliance;
