const express = require('express');
const router = express.Router();
const db = require('../db');
const { DEFAULT_OWNER_KEY, isOwnerSecretValid } = require('../utils/authUtils');

// Telemetry tracker (Public endpoint for visitor analytics)
router.post(['/api/analytics/track', '/analytics/track'], async (req, res) => {
  try {
    const updatedStats = await db.trackAnalytics(req.body);
    res.json({ success: true, analytics: updatedStats });
  } catch (err) {
    console.error("Failed tracking analytics event:", err);
    res.status(500).json({ message: 'خطأ في تسجيل بيانات الزائر' });
  }
});

// Owner Analytics Stats (Owner Protected Endpoint)
router.get(['/api/analytics/stats', '/analytics/stats'], async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'] || DEFAULT_OWNER_KEY;
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).json({ message: 'غير مصرح: مفتاح وصول السر الخاص بالمالك غير صحيح' });
  }

  try {
    const stats = await db.getAnalytics();
    res.json(stats);
  } catch (err) {
    console.error("Failed fetching analytics stats:", err);
    res.status(500).json({ message: 'خطأ في جلب إحصائيات المعرض' });
  }
});

// Reset Analytics Counters (Owner Protected Endpoint)
router.post(['/api/analytics/reset', '/analytics/reset'], async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'] || DEFAULT_OWNER_KEY;
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).json({ message: 'غير مصرح: مفتاح وصول السر الخاص بالمالك غير صحيح' });
  }

  try {
    const resetStats = await db.resetAnalytics();
    res.json({ success: true, message: 'تم تصفير جميع الإحصائيات بنجاح', analytics: resetStats });
  } catch (err) {
    console.error("Failed resetting analytics:", err);
    res.status(500).json({ message: 'خطأ في تصفير الإحصائيات' });
  }
});

module.exports = router;
