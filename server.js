import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';

import pagesRouter from './routes/pages.js';
import provinceRoutes from './routes/provinces.js';
import categoryRoutes from './routes/categories.js';
import cardRoutes from './routes/cards.js';
import authRoutes from './routes/auth.js'; // ✅ استيراد auth
import planRoutes from './routes/planRoutes.js';

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

// اختبار الاتصال
app.get('/', (req, res) => res.send('✅ Backend is working'));

// الاتصال بقاعدة البيانات
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log('🗄️  MongoDB connected'))
  .catch(err => {
    console.error('❌ MongoDB connection error:', err.message);
    process.exit(1);
  });

// استخدام المسارات
app.use('/api/pages', pagesRouter);
app.use('/api/provinces', provinceRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/cards', cardRoutes);
app.use('/api/auth', authRoutes); // ✅ تفعيل مسار التوثيق
app.use('/api/plans', planRoutes);

const port = process.env.PORT || 5000;
app.listen(port, () => console.log(`🚀 Backend running on http://localhost:${port}`));
