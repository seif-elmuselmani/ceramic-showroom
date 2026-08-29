/**
 * Comprehensive Arabic Text Normalizer for Ceramic & Sanitary Ware Catalog.
 * Handles:
 * - Alef normalization (أ, إ, آ, ٱ, bare ا)
 * - Taa Marbouta / Haa (ة, ه)
 * - Yaa / Alef Maqsoura (ي, ى)
 * - Waw / Hamza variations (ؤ, ئ, ء)
 * - Diacritics / Tashkeel & Tatweel (ـ)
 * - Punctuation, symbols, quotes, hyphens, slashes
 * - Stripping Arabic definite article ('ال' / 'الـ')
 */
export const normalizeArabicText = (text) => {
  if (!text) return '';
  return text
    .toString()
    .trim()
    .toLowerCase()
    .replace(/[\u064B-\u065F\u0670\u0640]/g, '') // Remove Tashkeel, Dagger Alef, Tatweel
    .replace(/[أإآٱ]/g, 'ا') // Normalize Alef variations
    .replace(/[ى]/g, 'ي') // Normalize Alef Maqsoura to Yaa
    .replace(/ة/g, 'ه') // Normalize Taa Marbouta to Haa
    .replace(/[ؤئ]/g, 'ء') // Normalize Hamza seats
    .replace(/[^\u0621-\u063A\u0641-\u064Aa-z0-9\s]/gi, ' ') // Strip non-alphanumeric chars & punctuation
    .replace(/\s+/g, ' ') // Collapse multiple spaces
    .trim();
};

/**
 * Strips leading 'ال' definition article from a single normalized Arabic word.
 */
const stripDefiniteArticle = (word) => {
  if (word.startsWith('ال') && word.length > 3) {
    return word.slice(2);
  }
  return word;
};

/**
 * Standard Ceramic, Porcelain, Sanitary Ware, & Paint Color Palette.
 * Contains every standard commercial & market color term used in Egypt & the Arab world.
 */
const COLOR_PALETTE = {
  // === White & Off-Whites (درجات الأبيض والأوف وايت) ===
  'ابيض': '#ffffff',
  'وايت': '#ffffff',
  'ناصع': '#ffffff',
  'اوفوايت': '#faf8f5',
  'افوايت': '#faf8f5',
  'اوف': '#faf8f5',
  'سكري': '#fbf8f1',
  'سكر': '#fbf8f1',
  'كريمي': '#fdfbf7',
  'كريم': '#fdfbf7',
  'لؤلؤي': '#fdfcf7',
  'لؤلؤ': '#fdfcf7',
  'بيرل': '#fdfcf7',
  'ايفوري': '#fffff0',
  'شانتيه': '#faf6f0',
  'حليبي': '#f8f9fa',
  'كلكتا': '#f8f9fa',
  'كرارا': '#f5f5f7',

  // === Beige, Pergamon, & Light Neutrals (البيج والبرجامون والعاجي) ===
  'بيج': '#f5e6d3',
  'بيجي': '#f5e6d3',
  'برجامون': '#f5e6d3',
  'برجمون': '#f5e6d3',
  'بيرجامون': '#f5e6d3',
  'بيرجمون': '#f5e6d3',
  'برجوان': '#f5e6d3',
  'برجاموني': '#f5e6d3',
  'برجموني': '#f5e6d3',
  'عاجي': '#f5e6d3',
  'عاج': '#f5e6d3',
  'رملي': '#e6d7b9',
  'رمل': '#e6d7b9',
  'ساند': '#e6d7b9',
  'جملي': '#c8a265',
  'بتشينو': '#ebd9c2',
  'ترافنتينو': '#e0ceb5',
  'هافان': '#c48b52',
  'سيمون': '#f7b094',
  'خوخي': '#fbb69e',
  'سومو': '#f4a582',

  // === Brown, Wood, & Coffee tones (البني، الخشبي، والكافيهات) ===
  'بني': '#6e3c1b',
  'بن': '#6e3c1b',
  'براون': '#6e3c1b',
  'خشب': '#8b5a2b',
  'خشبي': '#8b5a2b',
  'وود': '#8b5a2b',
  'تيك': '#7a481d',
  'ماهوجني': '#4e1609',
  'جوز': '#5c4033',
  'جوزي': '#5c4033',
  'بلوط': '#855b32',
  'كافيه': '#b89778',
  'كافيهات': '#b89778',
  'نسكافيه': '#aa8060',
  'لاتيه': '#cbb29b',
  'موكا': '#84624b',
  'شوكولاته': '#4a2c11',
  'شوكولا': '#4a2c11',
  'شوكليت': '#4a2c11',
  'كابتشينو': '#a67b5b',
  'توباكو': '#714b23',
  'عسلي': '#d49b35',
  'كراميل': '#af6e2d',
  'قرفه': '#8b4513',
  'بندق': '#8e6b4b',
  'بندقي': '#8e6b4b',

  // === Greys, Silver, Slate & Chrome (الرماديات، السيلفر، والكروم) ===
  'رمادي': '#64748b',
  'رماد': '#64748b',
  'رصاصي': '#64748b',
  'رصاص': '#64748b',
  'جراي': '#64748b',
  'جريج': '#b5aba1',
  'سيلفر': '#cbd5e1',
  'فضه': '#cbd5e1',
  'فضي': '#cbd5e1',
  'كروم': '#cbd5e1',
  'نيكل': '#c0c6c9',
  'ستانلس': '#d1d5db',
  'اينوكس': '#cbd5e1',
  'ميرور': '#e2e8f0',
  'بلاتين': '#dbe2e6',
  'بلاتينيوم': '#dbe2e6',
  'سموكي': '#78716c',
  'دخان': '#78716c',
  'دخاني': '#78716c',
  'اسمنتي': '#9ca3af',
  'اسمنت': '#9ca3af',
  'كونكريت': '#9ca3af',
  'فيراني': '#475569',
  'انثراسيت': '#334155',
  'انتراسيت': '#334155',
  'جرافيت': '#374151',
  'فحم': '#1f2937',
  'فحمي': '#1f2937',
  'شاركل': '#262626',

  // === Black & Dark Tones (الأسود والبلاك) ===
  'اسود': '#1e293b',
  'سواد': '#1e293b',
  'بلاك': '#0f172a',
  'كربوني': '#1e293b',
  'كربون': '#1e293b',
  'نيرو': '#111827',
  'ماركينا': '#171717',

  // === Gold, Bronze, Copper (الذهبي، النحاسي، والبرونزي) ===
  'ذهب': '#d4af37',
  'ذهبي': '#d4af37',
  'جولد': '#d4af37',
  'روزجولد': '#b76e79',
  'روز جولد': '#b76e79',
  'نحاس': '#b87333',
  'نحاسي': '#b87333',
  'كوبر': '#b87333',
  'برونز': '#cd7f32',
  'برونزي': '#cd7f32',
  'شامبين': '#e5d1b8',
  'شمبانيا': '#e5d1b8',
  'تيتانيوم': '#706e6b',

  // === Blue, Marine & Teal (الأزرق، الكحلي، والبترولي) ===
  'ازرق': '#1d4ed8',
  'بلو': '#1d4ed8',
  'كحلي': '#1e3a8a',
  'نافي': '#1e3a8a',
  'سماوي': '#38bdf8',
  'سما': '#38bdf8',
  'لبني': '#93c5fd',
  'بترولي': '#0e7490',
  'بترول': '#0e7490',
  'نيلي': '#312e81',
  'بحري': '#0369a1',
  'تركواز': '#0d9488',
  'تركوازي': '#0d9488',
  'تيركواز': '#0d9488',
  'فيروزي': '#14b8a6',
  'فيروز': '#14b8a6',
  'تيفاني': '#2dd4bf',

  // === Green, Olive & Mint (الأخضر، الزيتي، والمينت) ===
  'اخضر': '#15803d',
  'جرين': '#15803d',
  'زيتي': '#14532d',
  'زيت': '#14532d',
  'زتوني': '#3f6212',
  'زيتوني': '#3f6212',
  'اوليف': '#556b2f',
  'مينت': '#6ee7b7',
  'نعناع': '#6ee7b7',
  'نعناعي': '#6ee7b7',
  'بستاج': '#a7f3d0',
  'فستقي': '#a7f3d0',
  'فستق': '#a7f3d0',
  'زمردي': '#047857',
  'زمرد': '#047857',
  'عسكري': '#3b4d3c',
  'عشبي': '#4ade80',
  'تفاحي': '#84cc16',

  // === Red, Wine & Burgundy (الأحمر، النبيتي، والبورجوندي) ===
  'احمر': '#b91c1c',
  'ريد': '#b91c1c',
  'نبيتي': '#7f1d1d',
  'نبيت': '#7f1d1d',
  'عنابي': '#7f1d1d',
  'عناب': '#7f1d1d',
  'بورجوندي': '#722f37',
  'مارون': '#800000',
  'خمري': '#6b1724',
  'كرزي': '#991b1b',
  'دم الغزال': '#881337',
  'طوبي': '#c2410c',
  'قرميدي': '#c2410c',
  'بريك': '#b45309',

  // === Pink, Purple & Cashmere (البينك، الوردي، الموف، والكشمير) ===
  'بينك': '#fbcfe8',
  'وردي': '#f472b6',
  'ورد': '#f472b6',
  'روز': '#fb7185',
  'كشمير': '#d4a5a5',
  'موف': '#8b5cf6',
  'بنفسجي': '#8b5cf6',
  'بنفسج': '#8b5cf6',
  'لافندر': '#c4b5fd',
  'ارجواني': '#7c3aed',
  'ارجوان': '#7c3aed',
  'مرجاني': '#fb7185',
  'كورال': '#fb7185',

  // === Yellow & Orange (الأصفر والبرتقالي) ===
  'برتقالي': '#f97316',
  'برتقال': '#f97316',
  'اورانج': '#f97316',
  'اورنج': '#f97316',
  'مشمشي': '#fdba74',
  'مشمش': '#fdba74',
  'اصفر': '#eab308',
  'يلو': '#eab308',
  'ليموني': '#fde047',
  'ليمون': '#fde047',
  'خردلي': '#ca8a04',
  'ماسترد': '#ca8a04',
  'كموني': '#a16207',

  // === Marble & Surface Stone Types (الأسطح والرخاميات) ===
  'ماربل': '#e2e8f0',
  'رخام': '#e2e8f0',
  'رخامي': '#e2e8f0',
  'جرانيت': '#4b5563',
  'جرانيتي': '#4b5563',
  'ستيل': '#94a3b8'
};

/**
 * Returns a hex color code based on an Arabic color name with multi-tier fuzzy & token matching.
 * Bulletproof against:
 * 1. Misspellings (برجمون vs برجامون vs بيرجامون vs بيرجمون)
 * 2. Definite articles (البرجامون vs برجامون)
 * 3. Compound names (بيج دافئ, خشب محروق, رمادي رخامي, ابيض مع ذهبي)
 * 4. Alef/Yaa/Haa/Tashkeel letter differences
 */
export const getColorHexFromName = (colorName) => {
  if (!colorName || typeof colorName !== 'string') return '#334155';

  const normalized = normalizeArabicText(colorName);
  if (!normalized) return '#334155';

  // 1. Direct match on full normalized phrase (e.g., "برجمون", "اوف وايت")
  const compactNormalized = normalized.replace(/\s+/g, '');
  if (COLOR_PALETTE[compactNormalized]) {
    return COLOR_PALETTE[compactNormalized];
  }
  if (COLOR_PALETTE[normalized]) {
    return COLOR_PALETTE[normalized];
  }

  // 2. Direct match without 'ال' (e.g., "البرجامون" -> "برجامون", "الرمادي" -> "رمادي")
  const unPrefixed = stripDefiniteArticle(normalized);
  const unPrefixedCompact = stripDefiniteArticle(compactNormalized);
  if (COLOR_PALETTE[unPrefixedCompact]) {
    return COLOR_PALETTE[unPrefixedCompact];
  }
  if (COLOR_PALETTE[unPrefixed]) {
    return COLOR_PALETTE[unPrefixed];
  }

  // 3. Token-based matching (e.g. "برجامون - بيج دافئ" -> checks ["برجامون", "بيج", "دافئ"])
  const words = normalized.split(/\s+/).filter(Boolean);
  for (const rawWord of words) {
    const word = stripDefiniteArticle(rawWord);
    if (COLOR_PALETTE[word]) {
      return COLOR_PALETTE[word];
    }
  }

  // 4. Substring Search in the palette keys (ordered by keyword priority)
  const priorityKeywords = [
    'برجامون', 'برجمون', 'بيرجامون', 'عاجي', 'بيج',
    'اوفوايت', 'افوايت', 'سكري', 'كريمي', 'لؤلؤي', 'ابيض',
    'اسود', 'بلاك', 'فحم', 'كربوني',
    'روزجولد', 'ذهب', 'ذهبي', 'جولد', 'نحاس', 'برونز', 'شامبين',
    'سيلفر', 'فضه', 'فضي', 'كروم', 'نيكل', 'ستانلس', 'رمادي', 'رصاصي', 'جريج',
    'خشب', 'خشبي', 'بني', 'كافيه', 'نسكافيه', 'لاتيه', 'موكا', 'شوكولاته', 'هافان', 'عسلي',
    'كحلي', 'بترولي', 'تركواز', 'فيروزي', 'تيفاني', 'سماوي', 'لبني', 'ازرق',
    'زيتي', 'زتوني', 'مينت', 'بستاج', 'فستقي', 'زمردي', 'اخضر',
    'نبيتي', 'عنابي', 'بورجوندي', 'مارون', 'طوبي', 'قرميدي', 'احمر',
    'كشمير', 'لافندر', 'موف', 'بنفسجي', 'بينك', 'وردي', 'سيمون', 'خوخي', 'سومو',
    'برتقالي', 'اورانج', 'مشمشي', 'اصفر', 'ليموني', 'خردلي',
    'رخام', 'ماربل', 'جرانيت'
  ];

  for (const key of priorityKeywords) {
    const normKey = normalizeArabicText(key).replace(/\s+/g, '');
    if (compactNormalized.includes(normKey) || unPrefixedCompact.includes(normKey)) {
      if (COLOR_PALETTE[normKey]) {
        return COLOR_PALETTE[normKey];
      }
    }
  }

  // 5. Fallback Default
  return '#334155';
};
