require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const cloudinary = require('cloudinary').v2;
const helmet = require('helmet');
const bcrypt = require('bcryptjs');
const rateLimit = require('express-rate-limit');
const db = require('./db');
const JSZip = require('jszip');
const https = require('https');
const http = require('http');

const app = express();
const PORT = process.env.PORT || 5000;
const JWT_SECRET = process.env.JWT_SECRET || 'ceramic_admin_super_secret_key_2026';

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET environment variable is not set. Using insecure default fallback.");
}

// Cloudinary Configuration
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

// Rate limiters for security
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 login attempts per windowMs
  message: { message: 'محاولات دخول كثيرة خاطئة، يرجى المحاولة بعد 15 دقيقة.' },
  standardHeaders: true,
  legacyHeaders: false,
});

const uploadLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 30, // Limit each IP to 30 uploads per hour
  message: { message: 'لقد تجاوزت الحد الأقصى لرفع الصور المسموح به في الساعة.' },
  standardHeaders: true,
  legacyHeaders: false,
});

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
app.get(['/api/settings', '/settings'], async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (err) {
    console.error("Failed fetching settings:", err);
    res.status(500).json({ message: 'خطأ في جلب بيانات المعرض' });
  }
});

// Get Categories
app.get(['/api/categories', '/categories'], async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (err) {
    console.error("Failed fetching categories:", err);
    res.status(500).json({ message: 'خطأ في جلب تصنيفات المعرض' });
  }
});

// Get Brands List
app.get(['/api/brands', '/brands'], async (req, res) => {
  try {
    const brands = await db.getBrands();
    res.json(brands);
  } catch (err) {
    console.error("Failed fetching brands:", err);
    res.status(500).json({ message: 'خطأ في جلب قائمة الماركات' });
  }
});

// Get Products Catalog (with filtering & search)
app.get(['/api/products', '/products'], async (req, res) => {
  try {
    const { category, subcategory, finish, grade, brand, search, featured, inStock, onSale } = req.query;
    let products = await db.getProducts();

    if (category && category !== 'الكل') {
      products = products.filter(p => p.category === category);
    }

    if (subcategory && subcategory !== 'الكل') {
      products = products.filter(p => p.subcategory === subcategory);
    }

    if (brand && brand !== 'الكل') {
      products = products.filter(p => p.brand === brand || (p.origin && p.origin.includes(brand)));
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

    if (onSale === 'true') {
      products = products.filter(p => {
        const orig = Number(p.originalPrice) || 0;
        const curr = Number(p.price) || 0;
        if (orig <= curr) return false;
        if (p.offerEndDate) {
          const endDate = new Date(p.offerEndDate);
          if (!isNaN(endDate.getTime())) {
            endDate.setHours(23, 59, 59, 999);
            if (new Date() > endDate) return false;
          }
        }
        return true;
      });
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
  } catch (err) {
    console.error("Failed fetching products:", err);
    res.status(500).json({ message: 'خطأ في جلب المنتجات' });
  }
});

// Get Single Product Details
app.get(['/api/products/:id', '/products/:id'], async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json(product);
  } catch (err) {
    console.error("Failed fetching product details:", err);
    res.status(500).json({ message: 'خطأ في جلب تفاصيل المنتج' });
  }
});

// Admin Login (Secure with Bcrypt and Rate Limiting)
app.post(['/api/admin/login', '/admin/login'], loginLimiter, async (req, res) => {
  const { username, password } = req.body;
  const adminUser = process.env.ADMIN_USER;
  const adminPassHash = process.env.ADMIN_PASS_HASH;
  
  if (!adminUser || !adminPassHash) {
    console.error("❌ CRITICAL SECURITY ERROR: ADMIN_USER or ADMIN_PASS_HASH environment variables are not set!");
    return res.status(500).json({ message: 'خطأ داخلي في إعدادات الأمان للخادم' });
  }

  try {
    const isUserMatch = (username === adminUser);
    const isPasswordMatch = await bcrypt.compare(password, adminPassHash);

    if (isUserMatch && isPasswordMatch) {
      const token = jwt.sign({ username: adminUser, role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, username: 'الأدمن الرئيسي', message: 'تم تسجيل الدخول بنجاح' });
    }
  } catch (err) {
    console.error("Authentication check failed:", err);
  }

  res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
});

// ==================== SECRET OWNER BACKUP & EXCEL SYNC ENDPOINTS ====================
const DEFAULT_OWNER_KEY = 'elgazar_owner_super_secret_backup_2026';

function isOwnerSecretValid(providedKey) {
  if (!providedKey) return false;
  const cleanProvided = String(providedKey).trim().toLowerCase();
  const envKey = process.env.OWNER_SECRET_KEY ? String(process.env.OWNER_SECRET_KEY).trim().toLowerCase() : null;
  const defaultKey = DEFAULT_OWNER_KEY.toLowerCase();
  
  if (envKey && cleanProvided === envKey) return true;
  if (cleanProvided === defaultKey) return true;
  return false;
}

// Secret CSV / Excel Inventory Export (Owner Only)
app.get(['/api/owner/export-csv', '/owner/export-csv'], async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'];
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).json({ message: 'غير مصرح: مفتاح وصول السر الخاص بالمالك غير صحيح' });
  }

  try {
    const products = await db.getProducts();
    const headers = [
      'ID', 'كود الصنف', 'اسم الصنف', 'الفئة الرئيسية', 'الفئة الفرعية', 
      'الماركة', 'السعر الحالي', 'السعر قبل الخصم', 'الخصم %', 
      'تغطية الكرتونة م2', 'المقاس', 'اللمعة', 'الفرز', 'بلد المنشأ', 
      'حالة المخزن', 'صنف مميز', 'تاريخ التحديث', 'رابط الصورة'
    ];

    const escapeCsv = (val) => {
      if (val === null || val === undefined) return '""';
      const str = String(val).replace(/"/g, '""');
      return `"${str}"`;
    };

    const csvRows = [headers.map(escapeCsv).join(',')];

    products.forEach(p => {
      const orig = Number(p.originalPrice) || 0;
      const curr = Number(p.price) || 0;
      const discPercent = orig > curr ? Math.round(((orig - curr) / orig) * 100) : 0;

      const row = [
        p.id || p._id,
        p.code || '',
        p.name || '',
        p.category || '',
        p.subcategory || '',
        p.brand || '',
        curr,
        orig,
        discPercent + '%',
        p.boxCoverage || 1.44,
        p.dimensions || '',
        p.finish || '',
        p.grade || '',
        p.origin || '',
        p.inStock ? 'متوفر بالمخزن' : 'غير متوفر',
        p.featured ? 'مميز' : 'عادي',
        p.updatedAt || new Date().toISOString(),
        p.image || ''
      ];
      csvRows.push(row.map(escapeCsv).join(','));
    });

    const csvContent = '\uFEFF' + csvRows.join('\r\n'); // UTF-8 BOM for Arabic Excel compatibility
    const dateStr = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'text/csv; charset=utf-8');
    res.setHeader('Content-Disposition', `attachment; filename=ceramic_inventory_owner_backup_${dateStr}.csv`);
    res.send(csvContent);
  } catch (err) {
    console.error("Owner Excel CSV Export Error:", err);
    res.status(500).json({ message: 'خطأ في تصدير كشف إكسيل السري' });
  }
});

// Secret JSON Backup Export (Owner Only)
app.get(['/api/owner/export-json', '/owner/export-json'], async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'];
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).json({ message: 'غير مصرح: مفتاح وصول السر الخاص بالمالك غير صحيح' });
  }

  try {
    const products = await db.getProducts();
    const categories = await db.getCategories();
    const settings = await db.getSettings();

    const backupData = {
      timestamp: new Date().toISOString(),
      ownerSecretVerified: true,
      stats: {
        totalProducts: products.length,
        totalCategories: categories.length
      },
      settings,
      categories,
      products
    };

    const dateStr = new Date().toISOString().split('T')[0];
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename=ceramic_full_backup_owner_${dateStr}.json`);
    res.send(JSON.stringify(backupData, null, 2));
  } catch (err) {
    console.error("Owner JSON Export Error:", err);
    res.status(500).json({ message: 'خطأ في تصدير نسخة الباك أب السرية' });
  }
});

// Secret Owner Seed Test Data Endpoint (Owner Only)
app.get(['/api/owner/seed-test-data', '/owner/seed-test-data'], async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'];
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).json({ message: 'غير مصرح: مفتاح وصول السر غير صحيح' });
  }

  const testItems = [
    {
      id: "prod-t-001",
      name: "T - بورسلين إسباني كالاكاتا بيج 60x120 رويال",
      code: "T-ESP-ROYAL-60120",
      category: "بورسلين مستورد",
      subcategory: "إسباني",
      brand: "Porcelanosa",
      price: 610,
      originalPrice: 750,
      priceUnit: "متر مربع",
      boxCoverage: 1.44,
      dimensions: "60x120 سم",
      finish: "لامع كريستال",
      grade: "فرز أول ممتاز",
      origin: "إسبانيا",
      usage: "أرضيات ريسبشن فاخرة وصالونات",
      inStock: true,
      featured: true,
      description: "عينة اختبار جديدة T: بورسلين إسباني كالاكاتا بيج عروق ذهبية كريستال.",
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-t-002",
      name: "T - بورسلين هندي أونيكس جولدن 80x160 عملاق",
      code: "T-IND-ONYX-80160",
      category: "بورسلين مستورد",
      subcategory: "هندي",
      brand: "Graniser",
      price: 720,
      originalPrice: 890,
      priceUnit: "متر مربع",
      boxCoverage: 2.56,
      dimensions: "80x160 سم",
      finish: "سوبر جلوس 3D",
      grade: "فرز أول",
      origin: "الهند",
      usage: "تجليد حوائط ريسبشن وقصور",
      inStock: true,
      featured: true,
      description: "عينة اختبار جديدة T: بورسلين هندي مقاس عملاق 80x160 بعروق أونيكس ساحرة.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-t-003",
      name: "T - سيراميك أرضيات باركيه بلوط ألماني 20x120",
      code: "T-GER-OAK-20120",
      category: "سيراميك أرضيات",
      subcategory: "باركيه خشب",
      brand: "ماركة فاخرة",
      price: 290,
      originalPrice: 340,
      priceUnit: "متر مربع",
      boxCoverage: 1.20,
      dimensions: "20x120 سم",
      finish: "ملمس باركيه طبيعي",
      grade: "فرز أول",
      origin: "ألمانيا",
      usage: "غرف النوم، المكاتب، الممرات",
      inStock: true,
      featured: false,
      description: "عينة اختبار جديدة T: سيراميك باركيه خشب ألماني دافئ.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-t-004",
      name: "T - سيراميك حوائط حمامات رخام كليوباترا 30x90",
      code: "T-CLEO-WALL-3090",
      category: "سيراميك حوائط حمامات ومطابخ",
      subcategory: "بلاطات كبيرة",
      brand: "كليوباترا",
      price: 275,
      originalPrice: 320,
      priceUnit: "متر مربع",
      boxCoverage: 1.35,
      dimensions: "30x90 سم",
      finish: "لامع عاكس",
      grade: "فرز أول",
      origin: "مصر",
      usage: "حوائط حمامات وفنادق",
      inStock: true,
      featured: true,
      description: "عينة اختبار جديدة T: سيراميك حوائط كليوباترا بمقاس كبير.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-t-005",
      name: "T - بورسلين محلي رويال جراي 60x60 مط",
      code: "T-ROY-GRAY-6060",
      category: "بورسلين محلي",
      subcategory: "رويال",
      brand: "رويال",
      price: 340,
      originalPrice: 410,
      priceUnit: "متر مربع",
      boxCoverage: 1.44,
      dimensions: "60x60 سم",
      finish: "مط / حريري",
      grade: "فرز أول",
      origin: "مصر",
      usage: "أرضيات مطابخ وحمامات وعيادات",
      inStock: true,
      featured: false,
      description: "عينة اختبار جديدة T: بورسلين رويال محلي مط مقاوم للانزلاق.",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-t-006",
      name: "T - جرانيت طبيعي أسود أسباني 60x120",
      code: "T-GRAN-BLACK-60120",
      category: "رخام وجرانيت طبيعي",
      subcategory: "جرانيت مستورد",
      brand: "Botticino",
      price: 950,
      originalPrice: 1150,
      priceUnit: "متر مربع",
      boxCoverage: 1.44,
      dimensions: "60x120 سم",
      finish: "تلميع كريستال مائي",
      grade: "فرز أول ممتاز",
      origin: "إسبانيا",
      usage: "أرضيات قصور، صالونات، حوائط ماستر",
      inStock: true,
      featured: true,
      description: "عينة اختبار جديدة T: جرانيت طبيعي مستورد لون أسود ملكي.",
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-t-007",
      name: "T - ديكور موزاييك ستيل ذهبي فنتج 30x30",
      code: "T-STEEL-MOS-3030",
      category: "ديكورات وموزاييك وفن",
      subcategory: "ستيل وإكسسوار",
      brand: "Pyramids",
      price: 380,
      originalPrice: 450,
      priceUnit: "متر مربع",
      boxCoverage: 1.00,
      dimensions: "30x30 سم",
      finish: "بريق 3D ذهبي",
      grade: "فرز أول ممتاز",
      origin: "إيطاليا",
      usage: "خلفيات المطابخ والمداخل",
      inStock: true,
      featured: true,
      description: "عينة اختبار جديدة T: ديكور ستيل ذهبي لمسة فنية ساحرة.",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-t-008",
      name: "T - طقم خلاط حمام إيطالي جولد 4 قطع",
      code: "T-MIXER-GOLD-4P",
      category: "أطقم حمامات وخلاطات",
      subcategory: "خلاطات وحنفيات",
      brand: "Marazzi",
      price: 3200,
      originalPrice: 3900,
      priceUnit: "طقم كامل",
      boxCoverage: 1.00,
      dimensions: "قياسي",
      finish: "طلاء ذهبي حراري",
      grade: "فرز أول ممتاز",
      origin: "إيطاليا",
      usage: "حمامات ماستر وضيوف",
      inStock: true,
      featured: true,
      description: "عينة اختبار جديدة T: طقم خلاطات إيطالي ذهبي مقاوم للصدأ والترسبات.",
      image: "https://images.unsplash.com/photo-1620626011761-996317b69798?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-t-009",
      name: "T - بورسلين محلي الجوهرة كريستال 60x120",
      code: "T-JEW-CRYSTAL-60120",
      category: "بورسلين محلي",
      subcategory: "الجوهرة",
      brand: "الجوهرة",
      price: 480,
      originalPrice: 550,
      priceUnit: "متر مربع",
      boxCoverage: 1.44,
      dimensions: "60x120 سم",
      finish: "لامع كريستال",
      grade: "فرز أول",
      origin: "مصر",
      usage: "أرضيات ريسبشن ومطابخ",
      inStock: true,
      featured: true,
      description: "عينة اختبار جديدة T: بورسلين الجوهرة كريستال ناصع الجودة.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-t-010",
      name: "T - سيراميك مطابخ فنتج أزرق أندلسي 20x20",
      code: "T-AND-BLUE-2020",
      category: "سيراميك حوائط حمامات ومطابخ",
      subcategory: "موزاييك وديكور",
      brand: "Pyramids",
      price: 210,
      originalPrice: 260,
      priceUnit: "متر مربع",
      boxCoverage: 1.00,
      dimensions: "20x20 سم",
      finish: "مط زخرفي",
      grade: "فرز أول",
      origin: "إسبانيا",
      usage: "حوائط مطابخ وأرضيات ديكور",
      inStock: true,
      featured: false,
      description: "عينة اختبار جديدة T: سيراميك مطابخ كلاسيك أندلسي أزرق.",
      image: "https://images.unsplash.com/photo-1527352726752-1903158a3745?auto=format&fit=crop&w=1000&q=80"
    }
  ];

  try {
    const results = [];
    for (const item of testItems) {
      const added = await db.addProduct(item);
      results.push(added);
    }
    res.json({ message: 'تم إضافة الأصناف التجريبية T بنجاح للقواعد المباشرة السحابية', count: results.length, items: results });
  } catch (err) {
    console.error("Owner Seed Error:", err);
    res.status(500).json({ message: 'خطأ في إضافة الأصناف التجريبية' });
  }
});

// Secret Owner Media & Images Batch Downloader Gallery (Owner Only)
app.get(['/api/owner/export-media-archive', '/owner/export-media-archive'], async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'];
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).send('<h1>403 Forbidden - غير مصرح: مفتاح وصول السر غير صحيح</h1>');
  }

  try {
    const products = await db.getProducts();
    const productsWithImages = products.filter(p => p.image && p.image.trim() !== '');

    const imagesHtml = productsWithImages.map(p => `
      <div style="background:#ffffff; border-radius:14px; padding:16px; border:1px solid #e2e8f0; box-shadow:0 4px 12px rgba(0,0,0,0.05); text-align:center;">
        <img src="${p.image}" alt="${p.name}" style="width:100%; height:200px; object-fit:cover; border-radius:10px; margin-bottom:12px;" />
        <h4 style="margin:0 0 6px; color:#0f172a; font-size:15px;">${p.name}</h4>
        <p style="margin:0 0 10px; color:#64748b; font-size:13px;">كود: <strong>${p.code || 'بدون كود'}</strong> | فئة: <strong>${p.category}</strong></p>
        <a href="${p.image}" download="${(p.code || p.id)}.jpg" target="_blank" style="display:inline-block; background:#0f172a; color:#fbbf24; padding:8px 16px; border-radius:8px; text-decoration:none; font-weight:bold; font-size:13px;">📥 تحميل الصورة بجودة HD</a>
      </div>
    `).join('');

    const html = `
      <!DOCTYPE html>
      <html dir="rtl" lang="ar">
      <head>
        <meta charset="UTF-8">
        <title>أرشيف صور منتجات المعرض السرية | المالك</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background:#f8fafc; color:#0f172a; margin:0; padding:24px; }
          .container { max-width:1200px; margin:0 auto; }
          .header { background:linear-gradient(135deg, #0f172a 0%, #1e293b 100%); color:#ffffff; padding:24px; border-radius:16px; margin-bottom:24px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:16px; }
          .grid { display:grid; grid-template-columns:repeat(auto-fill, minmax(260px, 1fr)); gap:20px; }
          .btn-download-all { background:#fbbf24; color:#0f172a; padding:12px 24px; border-radius:10px; text-decoration:none; font-weight:bold; font-size:15px; border:none; cursor:pointer; }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <div>
              <h1 style="margin:0 0 6px; font-size:22px; color:#fbbf24;">🖼️ أرشيف وحافظة صور المنتجات HD الخاصة بالمالك</h1>
              <p style="margin:0; opacity:0.9; font-size:14px;">إجمالي الصور المحفوظة بالسيرفر السحابي: <strong>${productsWithImages.length} صورة عالية الجودة</strong></p>
            </div>
            <a href="/api/owner/download-images-zip?secret=${secretKey}" class="btn-download-all">📦 تحميل كافة الصور في ملف ZIP مضغوط بنقرة واحدة</a>
          </div>
          <div class="grid">
            ${imagesHtml}
          </div>
        </div>
      </body>
      </html>
    `;

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.send(html);
  } catch (err) {
    console.error("Owner Media Archive Error:", err);
    res.status(500).send('<h1>خطأ في جلب أرشيف الصور</h1>');
  }
});
function fetchImageBuffer(url, redirectCount = 0) {
  return new Promise((resolve) => {
    if (!url || redirectCount > 3) return resolve(null);
    try {
      const parsedUrl = new URL(url);
      const client = parsedUrl.protocol === 'https:' ? https : http;
      const options = {
        hostname: parsedUrl.hostname,
        path: parsedUrl.pathname + parsedUrl.search,
        method: 'GET',
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' },
        timeout: 3000
      };

      const req = client.request(options, (res) => {
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          const nextUrl = res.headers.location.startsWith('http') ? res.headers.location : (parsedUrl.origin + res.headers.location);
          return fetchImageBuffer(nextUrl, redirectCount + 1).then(resolve);
        }
        if (res.statusCode !== 200) {
          return resolve(null);
        }
        const data = [];
        res.on('data', chunk => data.push(chunk));
        res.on('end', () => resolve(Buffer.concat(data)));
      });

      req.on('error', () => resolve(null));
      req.on('timeout', () => {
        req.destroy();
        resolve(null);
      });
      req.end();
    } catch (e) {
      resolve(null);
    }
  });
}

// 1-Click Direct ZIP Download Endpoint for All Product Images (Owner Only)
app.get(['/api/owner/download-images-zip', '/owner/download-images-zip'], async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'];
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).json({ message: 'غير مصرح: مفتاح وصول السر غير صحيح' });
  }

  try {
    const products = await db.getProducts();
    const productsWithImages = products.filter(p => p.image && p.image.trim() !== '');

    if (productsWithImages.length === 0) {
      return res.status(404).json({ message: 'لا توجد صور منتجات متاحة للتحميل' });
    }

    const zip = new JSZip();
    const folder = zip.folder("ceramic_product_images");

    let manifestText = `أرشيف صور أصناف معرض السيراميك والبورسلين\nتاريخ التصدير: ${new Date().toLocaleString('ar-EG')}\n\n`;

    const fetchPromises = productsWithImages.map(async (p, idx) => {
      try {
        let buffer = null;
        if (p.image.startsWith('http://') || p.image.startsWith('https://')) {
          buffer = await fetchImageBuffer(p.image);
        } else if (p.image.startsWith('/uploads/') || p.image.startsWith('uploads/')) {
          const cleanRel = p.image.replace(/^\/+/, '');
          const localPath = path.join(__dirname, 'public', cleanRel);
          if (fs.existsSync(localPath)) {
            buffer = fs.readFileSync(localPath);
          }
        }

        const cleanCode = (p.code || p.id).replace(/[^a-zA-Z0-9_-]/g, '_');
        const ext = p.image.endsWith('.png') ? 'png' : 'jpg';
        const filename = `${cleanCode}_${idx + 1}.${ext}`;

        manifestText += `الصنف: ${p.name}\nالكود: ${p.code || p.id}\nالفئة: ${p.category}\nرابط الصورة: ${p.image}\nاسم الملف: ${filename}\n----------------------------------------\n`;

        if (buffer && buffer.length > 0) {
          folder.file(filename, buffer);
        }
      } catch (err) {
        console.error(`Failed packing image for ${p.id}:`, err.message);
      }
    });

    await Promise.all(fetchPromises);
    folder.file("inventory_images_manifest.txt", "\uFEFF" + manifestText);

    const zipBuffer = await zip.generateAsync({ type: 'nodebuffer', compression: 'STORE' });
    const dateStr = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/zip');
    res.setHeader('Content-Disposition', `attachment; filename=ceramic_all_product_images_${dateStr}.zip`);
    return res.end(zipBuffer);
  } catch (err) {
    console.error("Owner ZIP Download Error:", err);
    res.status(500).json({ message: 'خطأ في تجميع ملف الصور المضغوط: ' + err.message });
  }
});

// ==================== ADMIN PROTECTED ROUTES ====================

// Update Settings
app.put(['/api/settings', '/settings'], authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateSettings(req.body);
    res.json({ message: 'تم تحديث البيانات بنجاح', settings: updated });
  } catch (err) {
    console.error("Failed updating settings:", err);
    res.status(500).json({ message: 'خطأ في حفظ البيانات' });
  }
});

// Upload Product Image (Integrated with Cloudinary & Rate Limiting)
app.post(['/api/upload', '/upload'], authenticateToken, uploadLimiter, upload.single('image'), async (req, res) => {
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
app.post(['/api/products', '/products'], authenticateToken, async (req, res) => {
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
    res.status(500).json({ message: 'خطأ في إضافة المنتج لقاعدة البيانات' });
  }
});

// Update Product
app.put(['/api/products/:id', '/products/:id'], authenticateToken, async (req, res) => {
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
    res.status(500).json({ message: 'خطأ في تعديل المنتج لقاعدة البيانات' });
  }
});

// Delete Product
app.delete(['/api/products/:id', '/products/:id'], authenticateToken, async (req, res) => {
  try {
    const success = await db.deleteProduct(req.params.id);
    if (!success) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json({ message: 'تم حذف المنتج بنجاح' });
  } catch (err) {
    console.error("Failed deleting product:", err);
    res.status(500).json({ message: 'خطأ في حذف المنتج' });
  }
});

// Add New Category
app.post(['/api/categories', '/categories'], authenticateToken, async (req, res) => {
  const { name, icon } = req.body;
  if (!name || !icon) {
    return res.status(400).json({ message: 'اسم الفئة والشعار حقول مطلوبة' });
  }
  try {
    const newCategory = await db.addCategory(req.body);
    res.status(201).json({ message: 'تم إضافة الفئة بنجاح', category: newCategory });
  } catch (err) {
    console.error("Failed adding category:", err);
    res.status(500).json({ message: 'خطأ في إضافة الفئة' });
  }
});

// Update Category
app.put(['/api/categories/:id', '/categories/:id'], authenticateToken, async (req, res) => {
  try {
    const updated = await db.updateCategory(req.params.id, req.body);
    if (!updated) return res.status(404).json({ message: 'الفئة غير موجودة' });
    res.json({ message: 'تم تحديث الفئة بنجاح', category: updated });
  } catch (err) {
    console.error("Failed updating category:", err);
    res.status(500).json({ message: 'خطأ في تحديث الفئة' });
  }
});

// Delete Category
app.delete(['/api/categories/:id', '/categories/:id'], authenticateToken, async (req, res) => {
  try {
    const success = await db.deleteCategory(req.params.id);
    if (!success) return res.status(404).json({ message: 'الفئة غير موجودة' });
    res.json({ message: 'تم حذف الفئة بنجاح' });
  } catch (err) {
    console.error("Failed deleting category:", err);
    res.status(500).json({ message: 'خطأ في حذف الفئة' });
  }
});

// Real-Time Analytics Telemetry Tracking API (Public Tracking)
app.post(['/api/analytics/track', '/analytics/track'], async (req, res) => {
  try {
    const analytics = await db.trackAnalytics(req.body);
    res.json({ success: true, analytics });
  } catch (err) {
    console.error("Telemetry tracking error:", err);
    res.status(500).json({ message: 'خطأ في استقبال تتبع الإحصائيات' });
  }
});

// Real-Time Analytics Stats API (Admin Dashboard Access)
app.get(['/api/analytics/stats', '/analytics/stats'], async (req, res) => {
  try {
    const analytics = await db.getAnalytics();
    res.json(analytics);
  } catch (err) {
    console.error("Failed fetching analytics stats:", err);
    res.status(500).json({ message: 'خطأ في جلب إحصائيات المعرض' });
  }
});

// Real-Time Analytics Reset API (Admin Only)
app.post(['/api/analytics/reset', '/analytics/reset'], async (req, res) => {
  try {
    const analytics = await db.resetAnalytics();
    res.json({ message: 'تم تصفير جميع إحصائيات الزوار والواتساب بنجاح', analytics });
  } catch (err) {
    console.error("Failed resetting analytics stats:", err);
    res.status(500).json({ message: 'خطأ في تصفير إحصائيات المعرض' });
  }
});

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
