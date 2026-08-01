const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = 'ceramic_admin_super_secret_key_2026';

// Cloudinary Configuration for User Account: dv9zhgghq
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dv9zhgghq',
  api_key: process.env.CLOUDINARY_API_KEY || '874457588145155', // Fallback or env
  api_secret: process.env.CLOUDINARY_API_SECRET || 'secret'     // Fallback or env
});

// Middleware
app.use(cors());
app.use(express.json());

// Ensure local uploads folder exists
const uploadsDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}
app.use('/uploads', express.static(uploadsDir));

// Multer Storage setup
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    cb(null, 'tile-' + uniqueSuffix + ext);
  }
});
const upload = multer({ storage });

// Auth Middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];
  
  if (!token) return res.status(401).json({ message: 'غير مصرح: يرجى تسجيل الدخول' });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ message: 'جلسة التواجد انتهت، أعد تسجيل الدخول' });
    req.user = user;
    next();
  });
};

// ==================== PUBLIC API ROUTES ====================

// Get Showroom Settings & Info
app.get('/api/settings', (req, res) => {
  res.json(db.getSettings());
});

// Get Categories
app.get('/api/categories', (req, res) => {
  res.json(db.getCategories());
});

// Get Products (with Search & Filters)
app.get('/api/products', (req, res) => {
  let products = db.getProducts();
  const { category, search, finish, grade, featured, inStock } = req.query;

  if (category && category !== 'الكل') {
    products = products.filter(p => p.category === category);
  }

  if (finish && finish !== 'الكل') {
    products = products.filter(p => p.finish && p.finish.includes(finish));
  }

  if (grade && grade !== 'الكل') {
    products = products.filter(p => p.grade === grade);
  }

  if (featured === 'true') {
    products = products.filter(p => p.featured);
  }

  if (inStock === 'true') {
    products = products.filter(p => p.inStock);
  }

  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p => 
      p.name.toLowerCase().includes(q) ||
      p.code.toLowerCase().includes(q) ||
      (p.description && p.description.toLowerCase().includes(q)) ||
      (p.dimensions && p.dimensions.includes(q))
    );
  }

  res.json(products);
});

// Get Single Product Details
app.get('/api/products/:id', (req, res) => {
  const product = db.getProductById(req.params.id);
  if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
  res.json(product);
});

// Admin Login
app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body;
  if (username === 'admin' && password === 'admin123') {
    const token = jwt.sign({ username: 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
    return res.json({ token, username: 'الأدمن الرئيسي', message: 'تم تسجيل الدخول بنجاح' });
  }
  res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
});

// ==================== ADMIN PROTECTED ROUTES ====================

// Update Settings
app.put('/api/settings', authenticateToken, (req, res) => {
  const updated = db.updateSettings(req.body);
  res.json({ message: 'تم تحديث البيانات بنجاح', settings: updated });
});

// Upload Product Image (Integrated with Cloudinary & Local Fallback)
app.post('/api/upload', authenticateToken, upload.single('image'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'لم يتم اختيار صورة' });
  }

  const localUrl = `http://localhost:${PORT}/uploads/${req.file.filename}`;

  try {
    // Attempt Cloudinary Upload first
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
    console.log('⚠️ Cloudinary upload skipped, using local upload server URL:', err.message);
  }

  // Fallback to local server URL
  res.json({ imageUrl: localUrl, filename: req.file.filename, source: 'local' });
});

// Add New Product
app.post('/api/products', authenticateToken, (req, res) => {
  const { name, category, price } = req.body;
  if (!name || !category || price === undefined) {
    return res.status(400).json({ message: 'الاسم، الفئة، والسعر حقول مطلوبة' });
  }
  const newProduct = db.addProduct(req.body);
  res.status(201).json({ message: 'تم إضافة المنتج بنجاح', product: newProduct });
});

// Update Product
app.put('/api/products/:id', authenticateToken, (req, res) => {
  const updated = db.updateProduct(req.params.id, req.body);
  if (!updated) return res.status(404).json({ message: 'المنتج غير موجود' });
  res.json({ message: 'تم تحديث بيانات المنتج بنجاح', product: updated });
});

// Delete Product
app.delete('/api/products/:id', authenticateToken, (req, res) => {
  const success = db.deleteProduct(req.params.id);
  if (!success) return res.status(404).json({ message: 'المنتج غير موجود' });
  res.json({ message: 'تم حذف المنتج بنجاح' });
});

// Start Express Server
app.listen(PORT, () => {
  console.log(`🚀 Ceramic Showroom Server running on http://localhost:${PORT}`);
  console.log(`☁️ Cloudinary integrated for Cloud: dv9zhgghq`);
});
