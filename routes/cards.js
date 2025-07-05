// routes/cards.js
import express from 'express';
import Card from '../models/Card.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// ✅ جلب كل البطاقات (مع دعم البحث)
router.get('/', async (req, res) => {
  try {
    const { search } = req.query;
    let query = {};

    if (search) {
      query = {
        $or: [
          { title: { $regex: search, $options: 'i' } },
          { description: { $regex: search, $options: 'i' } },
          { content: { $regex: search, $options: 'i' } }
        ]
      };
    }

    const cards = await Card.find(query)
      .populate('province', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
});

// ✅ فلترة حسب المحافظة أو القسم
router.get('/filter', async (req, res) => {
  try {
    const { province, category } = req.query;
    const filter = {};
    if (province) filter.province = province;
    if (category) filter.category = category;

    const cards = await Card.find(filter)
      .populate('province', 'name')
      .populate('category', 'name')
      .sort({ createdAt: -1 });

    res.json(cards);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ جلب بطاقة واحدة باستخدام slug
router.get('/:slug', async (req, res) => {
  try {
    const card = await Card.findOne({ slug: req.params.slug })
      .populate('province', 'name')
      .populate('category', 'name')
      .populate('comments.user', 'name');

    if (!card) return res.status(404).json({ message: 'Card not found' });

    res.json(card);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ إنشاء بطاقة جديدة
router.post('/', async (req, res) => {
  try {
    const newCard = new Card(req.body);
    await newCard.save();
    res.status(201).json(newCard);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ تعديل بطاقة
router.put('/:id', async (req, res) => {
  try {
    const updated = await Card.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ حذف بطاقة
router.delete('/:id', async (req, res) => {
  try {
    await Card.findByIdAndDelete(req.params.id);
    res.json({ message: 'Deleted' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 إضافة تعليق (يحتاج تسجيل دخول)
router.post('/:id/comments', authMiddleware, async (req, res) => {
  try {
    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const comment = {
      user: req.user._id,
      text: req.body.text
    };

    card.comments.push(comment);
    await card.save();

    res.status(201).json({ message: 'تمت إضافة التعليق', comment });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// 🔹 إضافة أو تحديث تقييم (يحتاج تسجيل دخول)
router.post('/:id/rate', authMiddleware, async (req, res) => {
  try {
    const { value } = req.body;
    if (value < 1 || value > 5) return res.status(400).json({ message: 'التقييم يجب أن يكون بين 1 و 5' });

    const card = await Card.findById(req.params.id);
    if (!card) return res.status(404).json({ message: 'Card not found' });

    const existingRating = card.ratings.find(r => r.user.toString() === req.user._id.toString());

    if (existingRating) {
      existingRating.value = value;
    } else {
      card.ratings.push({ user: req.user._id, value });
    }

    await card.save();
    res.json({ message: 'تم حفظ التقييم' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

export default router;
