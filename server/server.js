require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const helmet = require('helmet');
const multer = require('multer');
const cookieParser = require('cookie-parser');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

if (!process.env.JWT_SECRET) {
  console.warn("⚠️ WARNING: JWT_SECRET environment variable is not set. Using insecure default fallback.");
}

// Middleware
app.use(helmet({
  crossOriginResourcePolicy: false, // Allow cross-origin images to load statically
}));
app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());
app.use(cookieParser());

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

// Serve static assets for local dev and fallback
const clientDistPath = path.join(__dirname, '..', 'client', 'dist');
app.use(express.static(clientDistPath, { index: false }));

// Catch-all route to serve index.html with Dynamic SEO Meta Tags
app.get('*', async (req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  let html;
  try {
    if (process.env.VERCEL) {
      // Fetch static HTML from the Vercel edge network to avoid file path issues in serverless functions
      const protocol = req.headers['x-forwarded-proto'] || 'https';
      const baseUrl = `${protocol}://${req.headers.host}`;
      const response = await fetch(`${baseUrl}/index.html`);
      if (!response.ok) throw new Error('Failed to fetch index.html from edge');
      html = await response.text();
    } else {
      html = fs.readFileSync(indexPath, 'utf8');
    }
  } catch (e) {
    console.error("Failed loading index.html:", e);
    return res.status(404).send('Frontend index not found. Please build the client.');
  }

  try {
    const productId = req.query.product;
    if (productId) {
      const product = await db.getProductById(productId);
      const settings = await db.getSettings();
      
      if (product) {
        const title = `سيراميك وبورسلين ${product.name} | ${settings.showroomName}`;
        const description = product.description || `تصفح تشكيلة ${product.category} في معرض ${settings.showroomName}.`;
        const imageUrl = product.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';
        
        const ogTags = `
          <meta property="og:title" content="${title}" />
          <meta property="og:description" content="${description}" />
          <meta property="og:image" content="${imageUrl}" />
          <meta property="og:url" content="${req.protocol}://${req.get('host')}${req.originalUrl}" />
          <meta name="twitter:card" content="summary_large_image" />
          <meta name="twitter:title" content="${title}" />
          <meta name="twitter:description" content="${description}" />
          <meta name="twitter:image" content="${imageUrl}" />
        `;
        
        html = html.replace('</head>', `${ogTags}</head>`);
        html = html.replace(/<title>.*?<\/title>/, `<title>${title}</title>`);
      }
    }
  } catch (err) {
    console.error("Error generating OpenGraph tags:", err);
  }

  res.send(html);
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
