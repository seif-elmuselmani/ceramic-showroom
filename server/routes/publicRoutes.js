const express = require('express');
const router = express.Router();
const db = require('../db');

// Get Showroom Settings & Info
router.get(['/api/settings', '/settings'], async (req, res) => {
  try {
    const settings = await db.getSettings();
    res.json(settings);
  } catch (err) {
    console.error("Failed fetching settings:", err);
    res.status(500).json({ message: 'خطأ في جلب بيانات المعرض' });
  }
});

// Get Categories
router.get(['/api/categories', '/categories'], async (req, res) => {
  try {
    const categories = await db.getCategories();
    res.json(categories);
  } catch (err) {
    console.error("Failed fetching categories:", err);
    res.status(500).json({ message: 'خطأ في جلب تصنيفات المعرض' });
  }
});

// Get Brands List
router.get(['/api/brands', '/brands'], async (req, res) => {
  try {
    const brands = await db.getBrands();
    res.json(brands);
  } catch (err) {
    console.error("Failed fetching brands:", err);
    res.status(500).json({ message: 'خطأ في جلب قائمة الماركات' });
  }
});

// Get Products Catalog (with filtering & search)
router.get(['/api/products', '/products'], async (req, res) => {
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
router.get(['/api/products/:id', '/products/:id'], async (req, res) => {
  try {
    const product = await db.getProductById(req.params.id);
    if (!product) return res.status(404).json({ message: 'المنتج غير موجود' });
    res.json(product);
  } catch (err) {
    console.error("Failed fetching product details:", err);
    res.status(500).json({ message: 'خطأ في جلب تفاصيل المنتج' });
  }
});

module.exports = router;
