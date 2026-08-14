require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const multer = require('multer');

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET environment variable is not set. Using insecure default fallback.");
}

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images to load statically
}));
app.use(cors());
app.use(express.json());

// Ensure local uploads folder exists
const uploadsDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, 'uploads');
if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {}
}

app.use('/uploads', express.static(uploadsDir, {
  maxAge: '30d',
  immutable: true,
  setHeaders: (res) => {
    res.setHeader('Cache-Control', 'public, max-age=2592000, immutable');
  }
}));

// Import Modular Routes
const publicRoutes = require('./routes/publicRoutes');
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const ownerRoutes = require('./routes/ownerRoutes');
const analyticsRoutes = require('./routes/analyticsRoutes');

// Mount Routes
app.use(publicRoutes);
app.use(authRoutes);
app.use(adminRoutes);
app.use(ownerRoutes);
app.use(analyticsRoutes);

// 404 API Endpoint Handler for unhandled routes
app.use('/api/*', (req, res) => {
  res.status(404).json({ message: 'المسار المطلوب غير موجود (404 Not Found)' });
});

// Express Error Handling Middleware (Catches Multer / Image upload errors)
app.use((err, req, res, next) => {
  console.error("❌ Central Server Error Handler Caught:", err);
  if (err.message && err.message.includes('نوع الملف')) {
    return res.status(400).json({ message: err.message });
  }
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ message: `خطأ في تحميل الملف: ${err.message}` });
  }
  res.status(500).json({ message: 'حدث خطأ داخلي في الخادم، تم تسجيل المشكلة وتأمين السيرفر' });
});

// Only listen if executed directly
if (require.main === module) {
  app.listen(PORT, () => {
    console.log(`🚀 Ceramic Showroom Server running on http://localhost:${PORT}`);
    console.log(`☁️ Cloudinary integrated for Cloud: dv9zhgghq`);
  });
}

module.exports = app;
