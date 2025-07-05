// routes/provinces.js
import express from 'express';
import Province from '../models/Province.js';

const router = express.Router();

// Get all provinces
router.get('/', async (req, res) => {
  try {
    const provinces = await Province.find().sort('name');
    res.json(provinces);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Create a province
router.post('/', async (req, res) => {
  try {
    const newProvince = new Province(req.body);
    await newProvince.save();
    res.status(201).json(newProvince);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update a province
router.put('/:id', async (req, res) => {
  try {
    const updated = await Province.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Delete a province
router.delete('/:id', async (req, res) => {
  try {
    await Province.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
