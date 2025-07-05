import express from 'express';
import User from '../models/User.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// حفظ خطة جديدة
router.post('/save-plan', authMiddleware, async (req, res) => {
  try {
    const { plan, mode } = req.body;
    const user = await User.findById(req.user.id);
    user.plans.push({ plan, mode, createdAt: new Date() });
    await user.save();
    res.status(200).json({ message: 'تم حفظ الخطة بنجاح' });
  } catch (err) {
    res.status(500).json({ error: 'فشل في حفظ الخطة' });
  }
});

// جلب جميع خطط المستخدم
router.get('/my-plans', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ error: 'المستخدم غير موجود' });

    res.json(user.plans || []);
  } catch (err) {
    res.status(500).json({ error: 'فشل في جلب الخطط' });
  }
});

export default router;
