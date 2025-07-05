// models/Province.js
import mongoose from 'mongoose';

const ProvinceSchema = new mongoose.Schema({
  name: { type: String, required: true, unique: true },
  image: String,
  description: String,
});

export default mongoose.model('Province', ProvinceSchema);
