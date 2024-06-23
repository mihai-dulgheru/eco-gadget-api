import { Schema, model } from 'mongoose';

const faqSchema = new Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const imageSchema = new Schema({
  alt: String,
  url: { type: String, required: true },
});

const linkSchema = new Schema({
  title: String,
  url: { type: String, required: true },
});

const socialSchema = new Schema({
  facebook: String,
  instagram: String,
  twitter: String,
  youtube: String,
});

const videoSchema = new Schema({
  title: String,
  url: { type: String, required: true },
});

const contactSchema = new Schema({
  address: String,
  email: String,
  phone: String,
});

const sectionSchema = new Schema({
  contact: contactSchema,
  content: String,
  faqs: [faqSchema],
  heading: String,
  images: [imageSchema],
  links: [linkSchema],
  social: socialSchema,
  video: videoSchema,
});

const recyclingInfoSchema = new Schema(
  {
    createdBy: { type: Schema.Types.ObjectId, ref: 'User' },
    date: { type: Date, default: Date.now },
    location: { longitude: Number, latitude: Number, name: String },
    picture: imageSchema,
    sections: [sectionSchema],
    subtitle: String,
    tags: [{ type: String, index: true }],
    title: { type: String, required: true, index: true },
    updatedBy: { type: Schema.Types.ObjectId, ref: 'User' },
  },
  {
    timestamps: true,
  }
);

const RecyclingInfo = model('RecyclingInfo', recyclingInfoSchema);

export default RecyclingInfo;
