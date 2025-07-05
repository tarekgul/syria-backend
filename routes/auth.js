// routes/auth.js
import express from 'express';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

const router = express.Router();

// إنشاء حساب
router.post('/register', async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // تحقق إذا كان المستخدم موجود مسبقاً
    const existing = await User.findOne({ email });
    if (existing) return res.status(400).json({ message: 'البريد الإلكتروني مستخدم مسبقاً' });

    const user = new User({ name, email, password });
    await user.save();

    res.status(201).json({ message: 'تم إنشاء الحساب بنجاح' });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء التسجيل', error: err.message });
  }
});

// تسجيل الدخول
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: 'البريد الإلكتروني غير موجود' });

    const isMatch = await user.comparePassword(password);
    if (!isMatch) return res.status(400).json({ message: 'كلمة المرور غير صحيحة' });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });

    res.json({
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (err) {
    res.status(500).json({ message: 'حدث خطأ أثناء تسجيل الدخول', error: err.message });
  }
});

export default router;
