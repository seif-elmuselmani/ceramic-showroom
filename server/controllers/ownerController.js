const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const https = require('https');
const http = require('http');
const JSZip = require('jszip');
const db = require('../db');
const { DEFAULT_OWNER_KEY, isOwnerSecretValid } = require('../utils/authUtils');

// Helper to fetch images for ZIP archiving
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

// Bulk Import Products (Owner Protected Endpoint)
exports.importProducts = async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'] || DEFAULT_OWNER_KEY;
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).json({ message: 'غير مصرح: مفتاح وصول السر الخاص بالمالك غير صحيح' });
  }

  const { products } = req.body;
  if (!Array.isArray(products) || products.length === 0) {
    return res.status(400).json({ message: 'لم يتم تزويد أي بيانات أصناف صالحة للاستيراد' });
  }

  try {
    const result = await db.bulkImportProducts(products);
    res.json({
      message: `تم استيراد وتحديث ${result.importedCount} صنف بنجاح في الكتالوج!`,
      importedCount: result.importedCount,
      items: result.items
    });
  } catch (err) {
    console.error("Bulk Import Error:", err);
    res.status(500).json({ message: 'خطأ في استيراد الأصناف: ' + err.message });
  }
};

// Secret CSV / Excel Inventory Export (Owner Only)
exports.exportCsv = async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'] || DEFAULT_OWNER_KEY;
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).json({ message: 'غير مصرح: مفتاح وصول السر الخاص بالمالك غير صحيح' });
  }

  try {
    const products = await db.getProducts(true); // Include soft-deleted products
    const headers = [
      'ID', 'كود الصنف', 'اسم الصنف', 'الفئة الرئيسية', 'الفئة الفرعية', 
      'الماركة', 'السعر الحالي', 'السعر قبل الخصم', 'الخصم %', 
      'تغطية الكرتونة م2', 'المقاس', 'اللمعة', 'الفرز', 'بلد المنشأ', 
      'حالة المخزن', 'حالة الحذف', 'صنف مميز', 'تاريخ التحديث', 'رابط الصورة'
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
        p.isDeleted ? 'ممسوح' : 'نشط',
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
};

// Secret JSON Backup Export (Owner Only)
exports.exportJson = async (req, res) => {
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
};

// Secret Owner Seed Test Data Endpoint (Owner Only)
exports.seedTestData = async (req, res) => {
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
};

// Secret Owner Media & Images Batch Downloader Gallery (Owner Only)
exports.exportMediaArchive = async (req, res) => {
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
};

// 1-Click Direct ZIP Download Endpoint for All Product Images (Owner Only)
exports.downloadImagesZip = async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'] || DEFAULT_OWNER_KEY;
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
          const localPath = path.join(__dirname, '..', 'public', cleanRel);
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
};

// Restore Soft-Deleted Product Endpoint (Owner / Admin Access)
exports.restoreProduct = async (req, res) => {
  const secretKey = req.query.secret || req.headers['x-owner-secret'] || DEFAULT_OWNER_KEY;
  if (!isOwnerSecretValid(secretKey)) {
    return res.status(403).json({ message: 'غير مصرح: مفتاح وصول السر الخاص بالمالك غير صحيح' });
  }

  try {
    const success = await db.restoreProduct(req.params.id);
    if (!success) {
      return res.status(404).json({ message: 'الصنف غير موجود أو مفعل بالفعل' });
    }
    res.json({ message: 'تم استرجاع الصنف بنجاح وإعادته للكتالوج!', productId: req.params.id });
  } catch (err) {
    console.error("Restore Product Error:", err);
    res.status(500).json({ message: 'خطأ في استرجاع الصنف: ' + err.message });
  }
};


