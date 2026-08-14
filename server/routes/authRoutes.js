const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const rateLimit = require('express-rate-limit');
const { JWT_SECRET } = require('../utils/authUtils');

// Rate limiters for security
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 login attempts per windowMs
  message: { message: 'محاولات دخول كثيرة خاطئة، يرجى المحاولة بعد 15 دقيقة.' },
  standardHeaders: true,
  legacyHeaders: false,
});

// Admin Login (Secure with Bcrypt and Rate Limiting)
router.post(['/api/admin/login', '/admin/login'], loginLimiter, async (req, res) => {
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

module.exports = router;
