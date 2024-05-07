const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  question: { type: String, required: true },
  answer: { type: String, required: true },
});

const imageSchema = new mongoose.Schema({
  alt: String,
  url: { type: String, required: true },
});

const linkSchema = new mongoose.Schema({
  title: String,
  url: { type: String, required: true },
});

const socialSchema = new mongoose.Schema({
  facebook: String,
  instagram: String,
  twitter: String,
  youtube: String,
});

const videoSchema = new mongoose.Schema({
  title: String,
  url: { type: String, required: true },
});

const contactSchema = new mongoose.Schema({
  address: String,
  email: String,
  phone: String,
});

const sectionSchema = new mongoose.Schema({
  contact: contactSchema,
  content: String,
  faqs: [faqSchema],
  heading: String,
  images: [imageSchema],
  links: [linkSchema],
  social: socialSchema,
  video: videoSchema,
});

const recyclingInfoSchema = new mongoose.Schema(
  {
    createdBy: String,
    date: { type: Date, default: Date.now },
    location: { latitude: Number, longitude: Number, name: String },
    picture: imageSchema,
    sections: [sectionSchema],
    subtitle: String,
    tags: [{ type: String, index: true }],
    title: { type: String, required: true, index: true },
    updatedBy: String,
  },
  {
    timestamps: true,
  }
);

const RecyclingInfo = mongoose.model('RecyclingInfo', recyclingInfoSchema);

module.exports = RecyclingInfo;
