const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'ceramic_admin_super_secret_key_2026';

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

const DEFAULT_OWNER_KEY = 'elgazar_owner_super_secret_backup_2026';

function isOwnerSecretValid(providedKey) {
  if (!providedKey) return false;
  const cleanProvided = String(providedKey).trim().toLowerCase();
  const envKey = process.env.OWNER_SECRET_KEY ? String(process.env.OWNER_SECRET_KEY).trim().toLowerCase() : null;
  
  // If environment variable is set, ONLY accept that key (disables default key for production security)
  if (envKey) {
    return cleanProvided === envKey;
  }
  
  // If no environment variable is set (local dev), fallback to default
  const defaultKey = DEFAULT_OWNER_KEY.toLowerCase();
  return cleanProvided === defaultKey;
}

module.exports = {
  JWT_SECRET,
  authenticateToken,
  DEFAULT_OWNER_KEY,
  isOwnerSecretValid
};
