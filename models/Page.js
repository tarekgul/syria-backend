// backend/models/Page.js
import mongoose from 'mongoose';

const SectionSchema = new mongoose.Schema({
  type:     { type: String, required: true },
  title:    { type: String }, 
  settings: { type: mongoose.Schema.Types.Mixed, default: {} },
  order:    { type: Number, default: 0 }
});

const PageSchema = new mongoose.Schema({
  slug:     { type: String, required: true, unique: true },
  title:    { type: String, required: true },
  order:    { type: Number, default: 0 },
  sections: [SectionSchema]
}, { timestamps: true });

export const Page = mongoose.model('Page', PageSchema);
