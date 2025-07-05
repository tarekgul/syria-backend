// backend/routes/pages.js
import express from 'express';
import { Page } from '../models/Page.js';

const router = express.Router();

// GET all pages
router.get('/', async (req, res) => {
  try {
    const pages = await Page.find({}, 'slug title order sections').sort('order');
    res.json(pages);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// GET one page by slug
router.get('/:slug', async (req, res) => {
  try {
    const page = await Page.findOne({ slug: req.params.slug });
    if (!page) return res.status(404).json({ message: 'Page not found' });
    res.json(page);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// POST create new page
router.post('/', async (req, res) => {
  try {
    const newPage = new Page(req.body);
    await newPage.save();
    res.status(201).json(newPage);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// PUT update page
router.put('/:slug', async (req, res) => {
  try {
    const updated = await Page.findOneAndUpdate(
      { slug: req.params.slug },
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ message: 'Page not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// DELETE page
router.delete('/:slug', async (req, res) => {
  try {
    const deleted = await Page.findOneAndDelete({ slug: req.params.slug });
    if (!deleted) return res.status(404).json({ message: 'Page not found' });
    res.json({ message: 'Page deleted' });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
