const fs = require('fs');
const path = require('path');

// Initial Default Data for Ultra-Luxury Ceramic & Porcelain Showroom (Sama & Elite Quality)
const initialData = {
  settings: {
    showroomName: "السيد الجزار للسيراميك والبورسلين",
    tagline: "تشطيب شقتك بيبدأ من عندنا 👌 بنوفر ليك جميع انواع السيراميك والبورسلين وأطقم الحمامات والوحدات",
    whatsappNumber: "201001366499",
    phoneNumber: "01001366499",
    facebookUrl: "https://www.facebook.com/share/1DMrALiUKx/",
    tiktokUrl: "https://www.tiktok.com/@ceramicaelgazar?_r=1&_t=ZS-98ZoTHkIMQ0",
    mapUrl: "https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&FORM=FBKPL1&q=%D8%A7%D9%84%D8%B9%D9%86%D9%88%D8%A7%D9%86%3A+%D8%A8%D9%86%D9%87%D8%A7+-%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%B3%D9%86%D9%87%D9%88%D9%89+%E2%80%93+%D8%A8%D8%AC%D9%88%D8%A7%D8%B1+%D9%83%D9%88%D8%A8%D8%B1%D9%8A+%D8%A7%D9%84%D8%B4%D9%85%D9%88%D8%AA%2C+Benha%2C+Egypt%2C+013&cp=30.460002%7E31.183300&lvl=13.4&style=r",
    mapUrl1: "https://www.google.com/maps/search/?api=1&query=%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%B9%D8%B7%D8%A7%D8%B1+%D9%85%D8%AF%D8%AE%D9%84+%D8%A8%D9%86%D9%87%D8%A7+%D8%A7%D9%84%D9%82%D8%A8%D9%84%D9%8A",
    mapUrl2: "https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&FORM=FBKPL1&q=%D8%A7%D9%84%D8%B9%D9%86%D9%88%D8%A7%D9%86%3A+%D8%A8%D9%86%D9%87%D8%A7+-%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%B3%D9%86%D9%87%D9%88%D9%89+%E2%80%93+%D8%A8%D8%AC%D9%88%D8%A7%D8%B1+%D9%83%D9%88%D8%A8%D8%B1%D9%8A+%D8%A7%D9%84%D8%B4%D9%85%D9%88%D8%AA%2C+Benha%2C+Egypt%2C+013&cp=30.460002%7E31.183300&lvl=13.4&style=r",
    address: "فرع 1: بنها - مدخل بنها القبلي - برج العطار | فرع 2: بنها - برج السنهوي - بجوار كوبري الشموت",
    workingHours: "يومياً من 10 صباحاً حتى 11:30 مساءً",
    announcement: "✨ عروض خاصة: خصم 20% على البورسلين الهندي والإسباني 60x120 لفترة محدودة!"
  },
  categories: [
    { id: "cat-1", name: "بورسلين مستورد", icon: "Layers", subcategories: ["إسباني", "هندي", "إيطالي", "أردني"] },
    { id: "cat-2", name: "بورسلين محلي", icon: "Grid", subcategories: ["كليوباترا", "الجوهرة", "رويال"] },
    { id: "cat-3", name: "سيراميك أرضيات", icon: "Square", subcategories: ["باركيه خشب", "رخامي", "حجري ومط"] },
    { id: "cat-4", name: "سيراميك حوائط حمامات ومطابخ", icon: "Layout", subcategories: ["موزاييك وديكور", "بلاطات كبيرة", "كلاسيك"] },
    { id: "cat-5", name: "رخام وجرانيت طبيعي", icon: "Box", subcategories: ["إيطالي", "مصري طبيعي", "جرانيت مستورد"] },
    { id: "cat-6", name: "ديكورات وموزاييك وفن", icon: "Sparkles", subcategories: ["موزاييك زجاجي", "لوحات فنية", "ستيل وإكسسوار"] },
    { id: "cat-7", name: "أطقم حمامات وخلاطات", icon: "Bath", subcategories: ["خلاطات وحنفيات", "وحدات وأحواض", "قعدات وإكسسوارات"] }
  ],
  products: [
    {
      id: "prod-201",
      name: "بورسلين إسباني كالاكاتا جولدن 60x120 سوبر جلوس",
      code: "ESP-CAL-60120",
      category: "بورسلين مستورد",
      subcategory: "إسباني",
      price: 590,
      priceUnit: "متر مربع",
      boxCoverage: 1.44,
      dimensions: "60x120 سم",
      finish: "لامع كريستالي عاكس",
      grade: "فرز أول ممتاز",
      origin: "إسبانيا (Porcelanosa Design)",
      usage: "أرضيات ريسبشن فاخرة، صالونات، حوائط حمامات ماستر",
      inStock: true,
      featured: true,
      description: "بورسلين إسباني ناصع مع عروق ذهبية ورمادية دقيقة بتقنية 3D Digital HD. مقاوم للبقع والأحماض وقطع ليزر بدون فواصل تقريباً.",
      image: "https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-202",
      name: "بورسلين هندي خرساني رمادي داكن 80x80 مط",
      code: "IND-CONC-8080",
      category: "بورسلين مستورد",
      subcategory: "هندي",
      price: 430,
      priceUnit: "متر مربع",
      boxCoverage: 1.92,
      dimensions: "80x80 سم",
      finish: "مط / ملمس سلكي",
      grade: "فرز أول",
      origin: "الهند (Graniser)",
      usage: "أرضيات مودرن، مكاتب، معارض، كافيهات",
      inStock: true,
      featured: true,
      description: "تصميم خرساني عصري يمنح المكان اتساعاً ولمسة مودرن فاخرة. مخصص للأماكن عالية الحركة.",
      image: "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-203",
      name: "سيراميك أرضيات باركيه أركاديا خشب داكن 20x120",
      code: "SER-PARK-DARK",
      category: "سيراميك أرضيات",
      subcategory: "باركيه خشب",
      price: 245,
      priceUnit: "متر مربع",
      boxCoverage: 1.20,
      dimensions: "20x120 سم",
      finish: "ملمس باركيه خشبي بارز",
      grade: "فرز أول",
      origin: "مصر (الجوهرة)",
      usage: "غرف النوم، الريسبشن، الممرات",
      inStock: true,
      featured: true,
      description: "سيراميك بديل الخشب الطبيعي بعروق بارزة تمنع الانزلاق وتمنح دفئاً راقياً للديكور.",
      image: "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-204",
      name: "سيراميك حوائط حمامات ستاتواريو أبيض رخامي 30x90",
      code: "WALL-STAT-3090",
      category: "سيراميك حوائط حمامات ومطابخ",
      subcategory: "بلاطات كبيرة",
      price: 260,
      priceUnit: "متر مربع",
      boxCoverage: 1.35,
      dimensions: "30x90 سم",
      finish: "لامع / كريستال",
      grade: "فرز أول",
      origin: "مصر (كليوباترا)",
      usage: "حوائط حمامات وفنادق",
      inStock: true,
      featured: false,
      description: "بلاطات حوائط بمقاس كبير وعروق رمادية متناسقة تُعطي إحساس الرخام الطبيعي المتصل.",
      image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-205",
      name: "ديكور حوائط موزاييك ذهبي وأسود هرمي 30x30",
      code: "MOS-GOLD-3030",
      category: "ديكورات وموزاييك وفن",
      subcategory: "موزاييك زجاجي",
      price: 320,
      priceUnit: "متر مربع",
      boxCoverage: 1.00,
      dimensions: "30x30 سم",
      finish: "بريق بارز 3D",
      grade: "فرز أول ممتاز",
      origin: "إيطاليا (Venezia Mosaic)",
      usage: "خلفية المطابخ، حوائط الدش، المداخل",
      inStock: true,
      featured: true,
      description: "موزاييك مطعم بجزئيات زجاجية وكريستال ذهبي يمنح لمسة فنية ساحرة للمكان.",
      image: "https://images.unsplash.com/photo-1565538810643-b5bdb714032a?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-206",
      name: "رخام إيطالي طبيعي بوتشينو كلاسيك 60x60",
      code: "MARB-BOT-6060",
      category: "رخام وجرانيت طبيعي",
      subcategory: "إيطالي",
      price: 850,
      priceUnit: "متر مربع",
      boxCoverage: 1.44,
      dimensions: "60x60 سم",
      finish: "تلميع كريستال مائي",
      grade: "فرز أول ممتاز",
      origin: "إيطاليا (Botticino Italy)",
      usage: "أرضيات قصور، صالونات، درج السلم",
      inStock: true,
      featured: true,
      description: "رخام طبيعي إيطالي مستورد بلون كريمي دافئ وعروق طبيعية لا تتكرر.",
      image: "https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-207",
      name: "بورسلين إيطالي نيرو ماركينا أسود 60x120",
      code: "POR-MARQ-BLACK",
      category: "بورسلين مستورد",
      subcategory: "إيطالي",
      price: 640,
      priceUnit: "متر مربع",
      boxCoverage: 1.44,
      dimensions: "60x120 سم",
      finish: "سوبر لامع عاكس",
      grade: "فرز أول",
      origin: "إيطاليا (Marazzi)",
      usage: "حوائط وأرضيات حمامات ماستر، ريسبشن، تجليد حوائط",
      inStock: true,
      featured: true,
      description: "بورسلين أسود ملكي بعروق بيضاء كالثلج، يعطي طابع الفخامة والرقي المطلق.",
      image: "https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-208",
      name: "سيراميك مطابخ فنتج أنقرة مسدس 25x25",
      code: "SER-HEX-2525",
      category: "سيراميك حوائط حمامات ومطابخ",
      subcategory: "موزاييك وديكور",
      price: 230,
      priceUnit: "متر مربع",
      boxCoverage: 1.00,
      dimensions: "25x25 sm",
      finish: "مط زخرفي",
      grade: "فرز أول",
      origin: "مصر (رويال)",
      usage: "حوائط وأرضيات مطابخ وديكورات",
      inStock: true,
      featured: false,
      description: "بلاط مسدس الشكل بزخارف هندسية أندلسية كلاسيكية يناسب الديكور الكلاسيكي والمودرن.",
      image: "https://images.unsplash.com/photo-1527352726752-1903158a3745?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-209",
      name: "بورسلين أردني صخري بيج 60x60 نخب أول",
      code: "JOR-ROCK-6060",
      category: "بورسلين مستورد",
      subcategory: "أردني",
      price: 380,
      priceUnit: "متر مربع",
      boxCoverage: 1.44,
      dimensions: "60x60 سم",
      finish: "مط ملمس ناعم مقاوم للانزلاق",
      grade: "فرز أول نخب ممتاز",
      origin: "الأردن (معامل الخزف الأردنية)",
      usage: "أرضيات مطابخ وحمامات، تراسات خارجية، ممرات عالية الحركة",
      inStock: true,
      featured: true,
      description: "بورسلين أردني فائق الجودة ذو لون بيج صخري طبيعي دافئ. متين ومقاوم للرطوبة والأحماض ودرجات الحرارة، مناسب جداً للأماكن المفتوحة والداخلية.",
      image: "https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=1000&q=80"
    },
    {
      id: "prod-210",
      name: "وحدة حوض حمام خشبية معلقة كلاسيك 80 سم مع خلاط إيطالي",
      code: "BATH-VAN-80CLASS",
      category: "أطقم حمامات وخلاطات",
      subcategory: "وحدات وأحواض",
      price: 4500,
      priceUnit: "قطعة بالخلاط",
      boxCoverage: 1.00,
      dimensions: "80 سم عرض",
      finish: "خشب معالج مقاوم للمياه دهان بولي يوريثان",
      grade: "فرز أول ممتاز",
      origin: "تقفيل محلي إكسسوارات مستوردة",
      usage: "حمامات رئيسية وحمامات ضيوف",
      inStock: true,
      featured: true,
      description: "وحدة حمام راقية مصنوعة من خشب MDF المعالج ضد الرطوبة والمياه. تشتمل على حوض بورسلين تركي أبيض وخلاط مياه إيطالي مطلي كروم فضي مضاد للصدأ.",
      image: "https://images.unsplash.com/photo-1620626011761-996317b69798?auto=format&fit=crop&w=1000&q=80"
    }
  ]
};

// In-Memory Database Store for Serverless & File Persistence
let memoryCache = JSON.parse(JSON.stringify(initialData));

class JsonDatabase {
  constructor() {
    this.initDb();
  }

  initDb() {
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
          
          // 2. Migrate Products (assign default subcategories to initial products if missing)
          initialData.products.forEach(initProd => {
            const cachedProd = memoryCache.products.find(p => p.id === initProd.id);
            if (cachedProd) {
              if (!cachedProd.subcategory) {
                cachedProd.subcategory = initProd.subcategory;
                migrated = true;
              }
            }
          });

          // Ensure any products without a subcategory have a default value
          memoryCache.products.forEach(prod => {
            if (!prod.subcategory) {
              const matchedCat = initialData.categories.find(c => c.name === prod.category);
              prod.subcategory = (matchedCat && matchedCat.subcategories && matchedCat.subcategories[0]) || '';
              migrated = true;
            }
          });
          
          if (migrated) {
            this.write(memoryCache);
          }
          return;
        } catch (e) {
          console.error("Failed reading data.json, fallback to memoryCache:", e);
        }
      }
    }
  }
  read() {
    return memoryCache;
  }

  write(data) {
    memoryCache = data;
    const dbPaths = [
      path.join(process.cwd(), 'server', 'data.json'),
      path.join(__dirname, 'data.json')
    ];

    for (const p of dbPaths) {
      try {
        fs.writeFileSync(p, JSON.stringify(data, null, 2), 'utf8');
      } catch (err) {
        // Ignore read-only filesystem errors in Serverless
      }
    }
    return true;
  }

  getSettings() {
    return this.read().settings;
  }

  updateSettings(newSettings) {
    const db = this.read();
    db.settings = { 
      ...db.settings, 
      ...newSettings
    };
    this.write(db);
    return db.settings;
  }

  getCategories() {
    return this.read().categories;
  }

  getProducts() {
    return this.read().products;
  }

  getProductById(id) {
    const db = this.read();
    return db.products.find(p => p.id === id);
  }

  addProduct(productData) {
    const db = this.read();
    const newProduct = {
      id: "prod-" + Date.now(),
      inStock: true,
      featured: false,
      priceUnit: "متر مربع",
      boxCoverage: Number(productData.boxCoverage) || 1.44,
      ...productData,
      price: Number(productData.price) || 0
    };
    db.products.unshift(newProduct);
    this.write(db);
    return newProduct;
  }

  updateProduct(id, productData) {
    const db = this.read();
    const index = db.products.findIndex(p => p.id === id);
    if (index === -1) return null;

    db.products[index] = {
      ...db.products[index],
      ...productData,
      price: Number(productData.price) ?? db.products[index].price,
      boxCoverage: Number(productData.boxCoverage) ?? db.products[index].boxCoverage
    };
    this.write(db);
    return db.products[index];
  }

  deleteProduct(id) {
    const db = this.read();
    const filtered = db.products.filter(p => p.id !== id);
    if (filtered.length === db.products.length) return false;
    db.products = filtered;
    this.write(db);
    return true;
  }
}

module.exports = new JsonDatabase();
