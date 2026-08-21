const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

// Initial Default Data for Ultra-Luxury Ceramic & Porcelain Showroom (Sama & Elite Quality)
const initialData = require('./data/fallbackData');

// In-Memory Database Store fallback
let memoryCache = JSON.parse(JSON.stringify(initialData));

const { getModels } = require('./models');

let Settings, Category, Product, Analytics;
let isConnected = false;

// Seed data if database collections are empty
async function seedDatabaseIfNeeded() {
  try {
    const productCount = await Product.countDocuments();
    if (productCount === 0) {
      console.log("🌱 Database is empty. Seeding initial data to MongoDB...");
      
      // Seed settings (only if none exists)
      const settingsCount = await Settings.countDocuments();
      if (settingsCount === 0) {
        await Settings.create(initialData.settings);
      }
      
      // Seed categories (only if none exists)
      const categoryCount = await Category.countDocuments();
      if (categoryCount === 0) {
        await Category.insertMany(initialData.categories);
      }
      
      // Seed products
      await Product.insertMany(initialData.products);
      
      console.log("🌱 Database successfully seeded with initialData");
    }
  } catch (err) {
    console.error("⚠️ Failed to seed MongoDB database:", err.message);
  }
}

// Cached MongoDB Connection Manager
async function connectToMongo() {
  if (isConnected) {
    return true;
  }
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    return false;
  }
  try {
    const dbConnection = await mongoose.connect(uri, {
      serverSelectionTimeoutMS: 5000
    });
    isConnected = dbConnection.connections[0].readyState === 1;
    
    // Register Models inside connection scope
    const models = getModels();
    Settings = models.Settings;
    Category = models.Category;
    Product = models.Product;
    Analytics = models.Analytics;
    
    console.log("🔌 Connected to MongoDB Atlas successfully");
    
    // Seed Database if empty
    await seedDatabaseIfNeeded();
    return true;
  } catch (err) {
    console.error("❌ Failed to connect to MongoDB Atlas:", err.message);
    isConnected = false;
    return false;
  }
}

class JsonDatabase {
  constructor() {
    this.initDb();
  }

  initDb() {
    // If running in development, we load local cache
    const dbPaths = [
      path.join(process.cwd(), 'server', 'data.json'),
      path.join(__dirname, 'data.json')
    ];

    for (const p of dbPaths) {
      if (fs.existsSync(p)) {
        try {
          const content = fs.readFileSync(p, 'utf8');
          memoryCache = JSON.parse(content);
          
          let migrated = false;
          
          // 1. Migrate Categories
          initialData.categories.forEach(initCat => {
            const cachedCat = memoryCache.categories.find(c => c.id === initCat.id);
            if (cachedCat) {
              if (!cachedCat.subcategories || cachedCat.subcategories.length === 0) {
                cachedCat.subcategories = initCat.subcategories;
                migrated = true;
              }
            }
          });
          
          // 2. Migrate Products (assign default subcategories and discounts to initial products if missing)
          initialData.products.forEach(initProd => {
            const cachedProd = memoryCache.products.find(p => p.id === initProd.id);
            if (cachedProd) {
              if (!cachedProd.subcategory) {
                cachedProd.subcategory = initProd.subcategory;
                migrated = true;
              }
              if (initProd.originalPrice && !cachedProd.originalPrice) {
                cachedProd.originalPrice = initProd.originalPrice;
                migrated = true;
              }
              if (initProd.offerEndDate && !cachedProd.offerEndDate) {
                cachedProd.offerEndDate = initProd.offerEndDate;
                migrated = true;
              }
              if (initProd.offerNote && !cachedProd.offerNote) {
                cachedProd.offerNote = initProd.offerNote;
                migrated = true;
              }
            }
          });

          // Ensure any products without code, brand or subcategory get safe values
          memoryCache.products.forEach(prod => {
            if (!prod.brand) {
              const origin = prod.origin || '';
              const name = prod.name || '';
              if (origin.includes('كليوباترا') || name.includes('كليوباترا')) prod.brand = 'كليوباترا';
              else if (origin.includes('الجوهرة') || name.includes('الجوهرة')) prod.brand = 'الجوهرة';
              else if (origin.includes('رويال') || name.includes('رويال')) prod.brand = 'رويال';
              else if (origin.includes('Porcelanosa') || name.includes('Porcelanosa')) prod.brand = 'Porcelanosa';
              else if (origin.includes('Marazzi') || name.includes('Marazzi')) prod.brand = 'Marazzi';
              else if (origin.includes('Graniser') || name.includes('Graniser')) prod.brand = 'Graniser';
              else if (origin.includes('الأردن') || name.includes('بيراميدز') || name.includes('Pyramids')) prod.brand = 'Pyramids';
              else if (name.includes('بوتشينو') || origin.includes('Botticino')) prod.brand = 'Botticino';
              else if (name.includes('SANIPURE') || origin.includes('SANIPURE')) prod.brand = 'SANIPURE';
              else if (name.includes('Duravit') || origin.includes('Duravit')) prod.brand = 'Duravit';
              else prod.brand = 'ماركة فاخرة';
              migrated = true;
            }
            if (!prod.code || !prod.code.trim()) {
              prod.code = 'SER-' + Math.floor(1000 + Math.random() * 9000);
              migrated = true;
            }
            if (!prod.subcategory) {
              const matchedCat = initialData.categories.find(c => c.name === prod.category);
              prod.subcategory = (matchedCat && matchedCat.subcategories && matchedCat.subcategories[0]) || '';
              migrated = true;
            }
          });
          
          if (migrated) {
            this.writeLocal(memoryCache);
          }
          return;
        } catch (e) {
          console.error("Failed reading data.json, fallback to memoryCache:", e);
        }
      }
    }
  }

  writeLocal(data) {
    // Vercel Ephemeral Filesystem Protection (Read-Only Fallback)
    if (process.env.VERCEL) {
      throw new Error("⚠️ النظام حالياً في وضع الطوارئ (القراءة فقط). تم إيقاف تعديلات السيرفر لمنع فقدان البيانات. يرجى الانتظار حتى تعود قاعدة البيانات للعمل.");
    }

    const dbPaths = [
      path.join(process.cwd(), 'server', 'data.json'),
      path.join(__dirname, 'data.json')
    ];

    for (const p of dbPaths) {
      try {
        fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
      } catch (err) {
        // Ignore read-only filesystem errors in Vercel
      }
    }
    return true;
  }

  async getSettings() {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        let s = await Settings.findOne().lean();
        if (!s) {
          s = await Settings.create(initialData.settings);
        }
        return s;
      }
    }
    return memoryCache.settings;
  }

  async updateSettings(newSettings) {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        let s = await Settings.findOne();
        if (!s) {
          s = new Settings(initialData.settings);
        }
        Object.assign(s, newSettings);
        await s.save();
        return s.toObject();
      }
    }
    memoryCache.settings = { 
      ...memoryCache.settings, 
      ...newSettings
    };
    this.writeLocal(memoryCache);
    return memoryCache.settings;
  }

  async getCategories() {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        const cats = await Category.find().lean();
        if (cats && cats.length > 0) {
          return cats;
        }
      }
    }
    return memoryCache.categories;
  }

  async getBrands() {
    const products = await this.getProducts();
    const brandsSet = new Set();
    products.forEach(p => {
      if (p.brand && p.brand.trim()) {
        brandsSet.add(p.brand.trim());
      }
    });
    return Array.from(brandsSet);
  }

  async getProducts(includeDeleted = false) {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        const query = includeDeleted ? {} : { isDeleted: { $ne: true } };
        return await Product.find(query).sort({ _id: -1 }).lean();
      }
    }
    if (includeDeleted) return memoryCache.products;
    return memoryCache.products.filter(p => !p.isDeleted);
  }

  async getProductById(id) {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        return await Product.findOne({ id, isDeleted: { $ne: true } }).lean();
      }
    }
    const found = memoryCache.products.find(p => p.id === id);
    if (found && found.isDeleted) return null;
    return found;
  }

  async addProduct(productData) {
    const id = "prod-" + Date.now();
    const cleanProduct = {
      id,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      featured: productData.featured !== undefined ? productData.featured : false,
      isDeleted: false,
      priceUnit: productData.priceUnit || "متر مربع",
      boxCoverage: Number(productData.boxCoverage) || 1.44,
      ...productData,
      price: Number(productData.price) || 0
    };

    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        const newProduct = await Product.create(cleanProduct);
        return newProduct.toObject();
      }
    }

    memoryCache.products.unshift(cleanProduct);
    this.writeLocal(memoryCache);
    return cleanProduct;
  }

  async updateProduct(id, productData) {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        const updateFields = { ...productData };
        if (productData.price !== undefined) updateFields.price = Number(productData.price);
        if (productData.boxCoverage !== undefined) updateFields.boxCoverage = Number(productData.boxCoverage);

        const updated = await Product.findOneAndUpdate(
          { id },
          { $set: updateFields },
          { new: true }
        ).lean();
        return updated;
      }
    }

    const index = memoryCache.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    memoryCache.products[index] = {
      ...memoryCache.products[index],
      ...productData,
      price: productData.price !== undefined ? Number(productData.price) : memoryCache.products[index].price,
      boxCoverage: productData.boxCoverage !== undefined ? Number(productData.boxCoverage) : memoryCache.products[index].boxCoverage
    };
    this.writeLocal(memoryCache);
    return memoryCache.products[index];
  }

  async deleteProduct(id) {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        const result = await Product.updateOne({ id }, { $set: { isDeleted: true } });
        return result.modifiedCount > 0;
      }
    }

    const index = memoryCache.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    memoryCache.products[index].isDeleted = true;
    this.writeLocal(memoryCache);
    return true;
  }

  async restoreProduct(id) {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        const result = await Product.updateOne({ id }, { $set: { isDeleted: false } });
        return result.modifiedCount > 0;
      }
    }

    const index = memoryCache.products.findIndex(p => p.id === id);
    if (index === -1) return false;
    memoryCache.products[index].isDeleted = false;
    this.writeLocal(memoryCache);
    return true;
  }

  async bulkImportProducts(items) {
    if (!Array.isArray(items) || items.length === 0) return { importedCount: 0, items: [] };

    const imported = [];
    for (const item of items) {
      if (!item.name || !item.category) continue;
      
      const existing = item.code ? memoryCache.products.find(p => p.code === item.code) : null;
      if (existing) {
        const updated = await this.updateProduct(existing.id, { ...item, isDeleted: false });
        if (updated) imported.push(updated);
      } else {
        const added = await this.addProduct({ ...item, isDeleted: false });
        if (added) imported.push(added);
      }
    }
    return { importedCount: imported.length, items: imported };
  }

  async addCategory(catData) {
    const id = "cat-" + Date.now();
    
    // Automatically match suitable Lucide icon names based on the Arabic name of the category
    let icon = "Layers";
    const nameLower = (catData.name || "").toLowerCase();
    if (nameLower.includes("حمام") || nameLower.includes("خلاط") || nameLower.includes("وحدات") || nameLower.includes("حوض")) {
      icon = "Bath";
    } else if (nameLower.includes("سيراميك") || nameLower.includes("بورسلين") || nameLower.includes("بلاط")) {
      icon = "Grid";
    } else if (nameLower.includes("ديكور") || nameLower.includes("موزاييك") || nameLower.includes("فن") || nameLower.includes("لوح")) {
      icon = "Sparkles";
    } else if (nameLower.includes("رخام") || nameLower.includes("جرانيت") || nameLower.includes("حجر")) {
      icon = "Home";
    }

    const cleanCat = {
      id,
      name: catData.name,
      icon,
      subcategories: Array.isArray(catData.subcategories) ? catData.subcategories : []
    };

    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        const newCat = await Category.create(cleanCat);
        return newCat.toObject();
      }
    }

    memoryCache.categories.push(cleanCat);
    this.writeLocal(memoryCache);
    return cleanCat;
  }

  async updateCategory(id, catData) {
    let icon = catData.icon;
    if (catData.name && !icon) {
      icon = "Layers";
      const nameLower = catData.name.toLowerCase();
      if (nameLower.includes("حمام") || nameLower.includes("خلاط") || nameLower.includes("وحدات") || nameLower.includes("حوض")) {
        icon = "Bath";
      } else if (nameLower.includes("سيراميك") || nameLower.includes("بورسلين") || nameLower.includes("بلاط")) {
        icon = "Grid";
      } else if (nameLower.includes("ديكور") || nameLower.includes("موزاييك") || nameLower.includes("فن") || nameLower.includes("لوح")) {
        icon = "Sparkles";
      } else if (nameLower.includes("رخام") || nameLower.includes("جرانيت") || nameLower.includes("حجر")) {
        icon = "Home";
      }
    }

    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        const updateFields = {
          name: catData.name,
          subcategories: catData.subcategories
        };
        if (icon) updateFields.icon = icon;

        const updated = await Category.findOneAndUpdate(
          { id },
          { $set: updateFields },
          { new: true }
        ).lean();
        return updated;
      }
    }

    const index = memoryCache.categories.findIndex(c => c.id === id);
    if (index === -1) return null;

    memoryCache.categories[index] = {
      ...memoryCache.categories[index],
      name: catData.name !== undefined ? catData.name : memoryCache.categories[index].name,
      icon: icon !== undefined ? icon : memoryCache.categories[index].icon,
      subcategories: catData.subcategories !== undefined ? catData.subcategories : memoryCache.categories[index].subcategories
    };
    this.writeLocal(memoryCache);
    return memoryCache.categories[index];
  }

  async deleteCategory(id) {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        const result = await Category.deleteOne({ id });
        return result.deletedCount > 0;
      }
    }

    const filtered = memoryCache.categories.filter(c => c.id !== id);
    if (filtered.length === memoryCache.categories.length) return false;
    memoryCache.categories = filtered;
    this.writeLocal(memoryCache);
    return true;
  }

  // Real-Time Analytics Telemetry Storage & Tracking (MongoDB Persistent + Local Cache)
  async getAnalytics() {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        let analyticsDoc = await Analytics.findOne({ id: 'main-analytics' }).lean();
        if (!analyticsDoc) {
          const fresh = {
            id: 'main-analytics',
            totalVisitors: 0,
            totalPageViews: 0,
            totalTimeSpentSeconds: 0,
            whatsappClicks: 0,
            whatsappClickDetails: { floating_badge: 0, product_card: 0, product_modal: 0, tile_calculator: 0 },
            productViews: {},
            searchQueries: {},
            mobileCount: 0,
            desktopCount: 0,
            lastActivity: new Date().toISOString()
          };
          analyticsDoc = await Analytics.create(fresh);
          analyticsDoc = analyticsDoc.toObject();
        }
        memoryCache.analytics = analyticsDoc;
        return analyticsDoc;
      }
    }

    if (!memoryCache.analytics) {
      memoryCache.analytics = {
        totalVisitors: 0,
        totalPageViews: 0,
        totalTimeSpentSeconds: 0,
        whatsappClicks: 0,
        whatsappClickDetails: { floating_badge: 0, product_card: 0, product_modal: 0, tile_calculator: 0 },
        productViews: {},
        searchQueries: {},
        mobileCount: 0,
        desktopCount: 0,
        lastActivity: new Date().toISOString()
      };
      this.writeLocal(memoryCache);
    }
    return memoryCache.analytics;
  }

  async resetAnalytics() {
    const zeroData = {
      totalVisitors: 0,
      totalPageViews: 0,
      totalTimeSpentSeconds: 0,
      whatsappClicks: 0,
      whatsappClickDetails: { floating_badge: 0, product_card: 0, product_modal: 0, tile_calculator: 0 },
      productViews: {},
      searchQueries: {},
      mobileCount: 0,
      desktopCount: 0,
      lastActivity: new Date().toISOString()
    };

    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        await Analytics.findOneAndUpdate({ id: 'main-analytics' }, { $set: zeroData }, { upsert: true });
      }
    }

    memoryCache.analytics = { id: 'main-analytics', ...zeroData };
    this.writeLocal(memoryCache);
    return memoryCache.analytics;
  }

  async trackAnalytics(eventData) {
    const analytics = await this.getAnalytics();
    const { type, payload } = eventData || {};

    if (type === 'pageview') {
      analytics.totalPageViews = (analytics.totalPageViews || 0) + 1;
      if (payload?.isNewVisitor) {
        analytics.totalVisitors = (analytics.totalVisitors || 0) + 1;
      }
      if (payload?.device === 'mobile') {
        analytics.mobileCount = (analytics.mobileCount || 0) + 1;
      } else {
        analytics.desktopCount = (analytics.desktopCount || 0) + 1;
      }
    } else if (type === 'heartbeat') {
      const seconds = Number(payload?.seconds) || 30;
      analytics.totalTimeSpentSeconds = (analytics.totalTimeSpentSeconds || 0) + seconds;
    } else if (type === 'whatsapp_click') {
      analytics.whatsappClicks = (analytics.whatsappClicks || 0) + 1;
      const source = payload?.source || 'general';
      if (!analytics.whatsappClickDetails) analytics.whatsappClickDetails = {};
      analytics.whatsappClickDetails[source] = (analytics.whatsappClickDetails[source] || 0) + 1;
    } else if (type === 'product_view') {
      const prodId = payload?.productId || payload?.id;
      if (prodId) {
        if (!analytics.productViews) analytics.productViews = {};
        analytics.productViews[prodId] = (analytics.productViews[prodId] || 0) + 1;
      }
    } else if (type === 'search') {
      const q = (payload?.query || '').trim().toLowerCase();
      if (q && q.length >= 2) {
        if (!analytics.searchQueries) analytics.searchQueries = {};
        analytics.searchQueries[q] = (analytics.searchQueries[q] || 0) + 1;
      }
    }

    analytics.lastActivity = new Date().toISOString();

    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        await Analytics.findOneAndUpdate(
          { id: 'main-analytics' },
          { $set: analytics },
          { upsert: true }
        );
      }
    }

    memoryCache.analytics = analytics;
    this.writeLocal(memoryCache);
    return analytics;
  }
}

module.exports = new JsonDatabase();
