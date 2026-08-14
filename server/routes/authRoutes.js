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
  const envUser = process.env.ADMIN_USER;
  const envHash = process.env.ADMIN_PASS_HASH;
  
  // Default master credentials: elgazar / Gz9823_Elgazar_Pass2026
  const defaultUser = 'elgazar';
  const defaultHash = '$2a$10$8IAtTsxUb4WAEYci10UdYOOurE3/KcgrHjV92taTBuyEqC7yni9Gy';

  try {
    // Check against ENV credentials if available
    let isEnvValid = false;
    if (envUser && envHash) {
      const isEnvUser = (username === envUser);
      const isEnvPass = await bcrypt.compare(password, envHash);
      if (isEnvUser && isEnvPass) isEnvValid = true;
    }

    // Check against default master credentials
    let isDefaultValid = false;
    const isDefUser = (username === defaultUser);
    const isDefPass = await bcrypt.compare(password, defaultHash);
    if (isDefUser && isDefPass) isDefaultValid = true;

    if (isEnvValid || isDefaultValid) {
      const token = jwt.sign({ username: username || 'admin', role: 'admin' }, JWT_SECRET, { expiresIn: '24h' });
      return res.json({ token, username: 'الأدمن الرئيسي', message: 'تم تسجيل الدخول بنجاح' });
    }
  } catch (err) {
    console.error("Authentication check failed:", err);
  }

  res.status(401).json({ message: 'اسم المستخدم أو كلمة المرور غير صحيحة' });
});

module.exports = router;
