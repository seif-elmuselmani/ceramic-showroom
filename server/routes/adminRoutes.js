const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const rateLimit = require('express-rate-limit');
const db = require('../db');
const { authenticateToken } = require('../utils/authUtils');

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Rate limiter for uploads
const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 uploads per hour
  message: { message: 'لقد تجاوزت الحد الأقصى لرفع الصور المسموح به في الساعة.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Ensure local uploads folder exists
const uploadsDir = process.env.VERCEL ? '/tmp' : path.join(__dirname, '..', 'uploads');
if (!process.env.VERCEL && !fs.existsSync(uploadsDir)) {
  try {
    fs.mkdirSync(uploadsDir, { recursive: true });
  } catch (e) {}
}

// Multer Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname).toLowerCase();
    const safeExt = ['.jpg', '.jpeg', '.png', '.webp'].includes(ext) ? ext : '.jpg';
    cb(null, 'tile-' + uniqueSuffix + safeExt);
  }
});

const allowedExtensions = ['.jpg', '.jpeg', '.png', '.webp'];
const upload = multer({ 
  storage,
  fileFilter: (req, file, cb) => {
    const allowedMimeTypes = ['image/jpeg', 'image/png', 'image/webp'];
    const ext = path.extname(file.originalname).toLowerCase();
    if (allowedMimeTypes.includes(file.mimetype) && allowedExtensions.includes(ext)) {
      cb(null, true);
    } else {
      cb(new Error('نوع الملف أو الامتداد غير مدعوم! يرجى رفع صور فقط بصيغة (JPG, JPEG, PNG, WEBP)'));
    }
  }
});

// Update Settings
router.put(['/api/settings', '/settings'], authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateSettings(req.body);
    res.json({ message: 'تم تحديث البيانات بنجاح', settings: updated });
  } catch (err) {
    console.error("Failed updating settings:", err);
    res.status(500).json({ message: err.message || 'خطأ في حفظ البيانات' });
  }
});

// Upload Product Image (Integrated with Cloudinary & Rate Limiting)
router.post(['/api/upload', '/upload'], authenticateToken, uploadLimiter, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'لم يتم اختيار صورة' });
  }

  const localUrl = `/uploads/${req.file.filename}`;

  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: 'ceramic_showroom_tiles',
      resource_type: 'image'
    });

    if (result && result.secure_url) {
      console.log('✅ Image uploaded to Cloudinary:', result.secure_url);
      return res.json({ 
        imageUrl: result.secure_url, 
        public_id: result.public_id,
        source: 'cloudinary' 
      });
    }
  } catch (err) {
    console.log('⚠️ Cloudinary upload skipped, using local upload:', err.message);
  }

  res.json({ imageUrl: localUrl, filename: req.file.filename, source: 'local' });
});

// Add New Product
router.post(['/api/products', '/products'], authenticateToken, async (req, res) => {
  const { name, category, price } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ message: 'الاسم، الفئة، والسعر حقول مطلوبة' });
  }
  try {
    const sanitizedBody = {
      ...req.body,
      price: Math.max(0, Number(req.body.price) || 0),
      originalPrice: Math.max(0, Number(req.body.originalPrice) || 0),
      discountPercent: Math.max(0, Number(req.body.discountPercent) || 0),
      boxCoverage: Math.max(0.1, Number(req.body.boxCoverage) || 1.44)
    };
    const newProduct = await db.addProduct(sanitizedBody);
    res.status(201).json({ message: 'تم إضافة المنتج بنجاح', product: newProduct });
  } catch (err) {
    console.error("Failed adding product:", err);
    res.status(500).json({ message: err.message || 'خطأ في إضافة المنتج لقاعدة البيانات' });
  }
});

// Update Product
router.put(['/api/products/:id', '/products/:id'], authenticateToken, async (req, res) => {
  try {
    const sanitizedBody = { ...req.body };
    if (req.body.price !== undefined) {
      sanitizedBody.price = Math.max(0, Number(req.body.price) || 0);
    }
    if (req.body.originalPrice !== undefined) {
      sanitizedBody.originalPrice = Math.max(0, Number(req.body.originalPrice) || 0);
    }
    if (req.body.discountPercent !== undefined) {
      sanitizedBody.discountPercent = Math.max(0, Number(req.body.discountPercent) || 0);
    }
    if (req.body.boxCoverage !== undefined) {
      sanitizedBody.boxCoverage = Math.max(0.1, Number(req.body.boxCoverage) || 1.44);
    }

    const updatedProduct = await db.updateProduct(req.params.id, sanitizedBody);
    if (!updatedProduct) {
      return res.status(404).json({ message: 'المنتج غير موجود' });
    }
    res.json({ message: 'تم تحديث بيانات المنتج بنجاح', product: updatedProduct });
  } catch (err) {
    console.error("Failed updating product:", err);
    res.status(500).json({ message: err.message || 'خطأ في تعديل المنتج لقاعدة البيانات' });
  }
});

// Delete Product
router.delete(['/api/products/:id', '/products/:id'], authenticateToken, async (req, res) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (err) {
    console.error("Failed deleting product:", err);
    res.status(500).json({ message: err.message || 'خطأ في حذف المنتج' });
  }
});

// Add New Category
router.post(['/api/categories', '/categories'], authenticateToken, async (req, res) => {
  const { name, icon } = req.body;
  if (!name || !icon) {
    return res.status(400).json({ message: 'اسم الفئة والشعار حقول مطلوبة' });
  }
  try {
    const newCategory = await db.addCategory(req.body);
    res.status(201).json({ message: 'تم إضافة الفئة بنجاح', category: newCategory });
  } catch (err) {
    console.error("Failed adding category:", err);
    res.status(500).json({ message: err.message || 'خطأ في إضافة الفئة' });
  }
});

// Update Category
router.put(['/api/categories/:id', '/categories/:id'], authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'الفئة غير موجودة' });
    res.json({ message: 'تم تحديث الفئة بنجاح', category: updated });
  } catch (err) {
    console.error("Failed updating category:", err);
    res.status(500).json({ message: err.message || 'خطأ في تحديث الفئة' });
  }
});

// Delete Category
router.delete(['/api/categories/:id', '/categories/:id'], authenticateToken, async (req, res) => {
  try {
    const success = await db.deleteCategory(req.params.id);
    if (!success) return res.status(404).json({ message: 'الفئة غير موجودة' });
    res.json({ message: 'تم حذف الفئة بنجاح' });
  } catch (err) {
    console.error("Failed deleting category:", err);
    res.status(500).json({ message: err.message || 'خطأ في حذف الفئة' });
  }
});

module.exports = router;
