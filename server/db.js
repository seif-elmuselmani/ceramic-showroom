const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

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
    announcement: "✨ عروض خاصة: خصم 20% على البورسلين الهندي والإسباني 60x120 لفترة محدودة!",
    address1: "بنها - مدخل بنها القبلي - برج العطار",
    address2: "فرع 2: بنها - برج السنهوي - بجوار كوبري الشموت"
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
      originalPrice: 720,
      offerEndDate: "2026-08-31",
      offerNote: "تصفيات المستورد",
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
      originalPrice: 500,
      offerEndDate: "2026-08-25",
      offerNote: "عرض الموسم الصيفي",
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
      description: "موزاييك مطعم بجزيئات زجاجية وكريستال ذهبي يمنح لمسة فنية ساحرة للمكان.",
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
    },
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
  ]
};

// In-Memory Database Store fallback
let memoryCache = JSON.parse(JSON.stringify(initialData));

// Mongoose Schema Definitions
const SettingsSchema = new mongoose.Schema({
  showroomName: { type: String, default: "السيد الجزار للسيراميك والبورسلين" },
  tagline: { type: String, default: "" },
  whatsappNumber: { type: String, default: "" },
  phoneNumber: { type: String, default: "" },
  facebookUrl: { type: String, default: "" },
  tiktokUrl: { type: String, default: "" },
  mapUrl: { type: String, default: "" },
  mapUrl1: { type: String, default: "" },
  mapUrl2: { type: String, default: "" },
  address: { type: String, default: "" },
  workingHours: { type: String, default: "" },
  announcement: { type: String, default: "" },
  address1: { type: String, default: "" },
  address2: { type: String, default: "" }
}, { minimize: false });

const CategorySchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  icon: { type: String, required: true },
  subcategories: [String]
});

const ProductSchema = new mongoose.Schema({
  id: { type: String, required: true, unique: true, index: true },
  name: { type: String, required: true },
  code: { type: String, required: true, index: true },
  brand: { type: String, index: true },
  category: { type: String, required: true, index: true },
  subcategory: { type: String, index: true },
  price: { type: Number, required: true },
  originalPrice: { type: Number, default: 0 },
  offerEndDate: String,
  offerNote: String,
  priceUnit: { type: String, default: "متر مربع" },
  boxCoverage: { type: Number, default: 1.44 },
  dimensions: String,
  finish: String,
  grade: String,
  origin: String,
  usage: String,
  inStock: { type: Boolean, default: true },
  featured: { type: Boolean, default: false },
  description: String,
  image: String
});

let Settings, Category, Product;
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
    Settings = mongoose.models.Settings || mongoose.model('Settings', SettingsSchema);
    Category = mongoose.models.Category || mongoose.model('Category', CategorySchema);
    Product = mongoose.models.Product || mongoose.model('Product', ProductSchema);
    
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

  async getProducts() {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        return await Product.find().sort({ _id: -1 }).lean();
      }
    }
    return memoryCache.products;
  }

  async getProductById(id) {
    if (process.env.MONGODB_URI) {
      const connected = await connectToMongo();
      if (connected) {
        return await Product.findOne({ id }).lean();
      }
    }
    return memoryCache.products.find(p => p.id === id);
  }

  async addProduct(productData) {
    const id = "prod-" + Date.now();
    const cleanProduct = {
      id,
      inStock: productData.inStock !== undefined ? productData.inStock : true,
      featured: productData.featured !== undefined ? productData.featured : false,
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
        const result = await Product.deleteOne({ id });
        return result.deletedCount > 0;
      }
    }

    const filtered = memoryCache.products.filter(p => p.id !== id);
    if (filtered.length === memoryCache.products.length) return false;
    memoryCache.products = filtered;
    this.writeLocal(memoryCache);
    return true;
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

  // Real-Time Analytics Telemetry Storage & Tracking (Starting strictly from 0)
  async getAnalytics() {
    if (!memoryCache.analytics) {
      memoryCache.analytics = {
        totalVisitors: 0,
        totalPageViews: 0,
        totalTimeSpentSeconds: 0,
        whatsappClicks: 0,
        whatsappClickDetails: {
          floating_badge: 0,
          product_card: 0,
          product_modal: 0,
          tile_calculator: 0
        },
        productViews: {},
        searchQueries: {},
        mobileCount: 0,
        desktopCount: 0,
        lastActivity: new Date().toISOString()
      };
    }
    return memoryCache.analytics;
  }

  async resetAnalytics() {
    memoryCache.analytics = {
      totalVisitors: 0,
      totalPageViews: 0,
      totalTimeSpentSeconds: 0,
      whatsappClicks: 0,
      whatsappClickDetails: {
        floating_badge: 0,
        product_card: 0,
        product_modal: 0,
        tile_calculator: 0
      },
      productViews: {},
      searchQueries: {},
      mobileCount: 0,
      desktopCount: 0,
      lastActivity: new Date().toISOString()
    };
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
    memoryCache.analytics = analytics;
    this.writeLocal(memoryCache);
    return analytics;
  }
}

module.exports = new JsonDatabase();
