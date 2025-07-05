// models/Card.js
import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  text: String,
  createdAt: { type: Date, default: Date.now }
});

const ratingSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  value: { type: Number, min: 1, max: 5 }
});

const CardSchema = new mongoose.Schema({
  title: { type: String, required: true },
  slug: { type: String, required: true, unique: true },
  image: String,
  description: String,
  content: String,
  gallery: [String],
  province: { type: mongoose.Schema.Types.ObjectId, ref: 'Province' },
  category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' },
  comments: [commentSchema],
  ratings: [ratingSchema],
  location: {
  lat: Number,
  lng: Number
}

}, { timestamps: true });

export default mongoose.model('Card', CardSchema);
