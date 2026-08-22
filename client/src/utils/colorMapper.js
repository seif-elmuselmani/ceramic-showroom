/**
 * Utility to normalize Arabic text to handle common misspellings/variations.
 * - Converts various forms of Alef (أ, إ, آ) to bare Alef (ا).
 * - Converts Taa Marbouta (ة) to Haa (ه).
 * - Removes diacritics (تشكيل).
 * - Trims and lowercases.
 */
export const normalizeArabicText = (text) => {
  if (!text) return '';
  return text
    .trim()
    .toLowerCase()
    .replace(/[أإآ]/g, 'ا') // Normalize Alef
    .replace(/ة/g, 'ه') // Normalize Taa Marbouta
    .replace(/[\u064B-\u065F]/g, '') // Remove Arabic diacritics (Tashkeel)
    .replace(/\s+/g, ''); // Remove spaces to match perfectly
};

/**
 * Returns a hex color code based on an Arabic color name.
 * Uses a robust normalized dictionary to prevent typos from breaking the UI.
 */
export const getColorHexFromName = (colorName) => {
  const normalized = normalizeArabicText(colorName);
  
  if (!normalized) return '#334155'; // Fallback Slate

  // Exact Match Dictionary (Fast Path)
  const exactMatches = {
    'ابيض': '#ffffff',
    'اسود': '#1e293b', // Slate dark instead of pure black for better UX
    'بيج': '#f5e6d3',
    'عاجي': '#f5e6d3',
    'برجامون': '#f5e6d3',
    'ذهب': '#d4af37',
    'ذهبي': '#d4af37',
    'فضه': '#cbd5e1',
    'فضي': '#cbd5e1',
    'كروم': '#cbd5e1',
    'رصاصي': '#64748b',
    'رمادي': '#64748b',
    'خشب': '#8b5a2b',
    'خشبي': '#8b5a2b',
    'بني': '#8b5a2b',
    'ازرق': '#1d4ed8',
    'سماوي': '#3b82f6',
    'كحلي': '#1e3a8a',
    'اخضر': '#15803d',
    'زيتي': '#14532d',
    'احمر': '#b91c1c',
    'نبيتي': '#7f1d1d',
    'عنابي': '#7f1d1d',
    'بينك': '#fbcfe8',
    'وردي': '#fbcfe8',
    'موف': '#8b5cf6',
    'بنفسجي': '#8b5cf6',
    'برتقالي': '#f97316',
    'اورانج': '#f97316',
    'اصفر': '#eab308'
  };

  // If exact match found after normalization
  if (exactMatches[normalized]) {
    return exactMatches[normalized];
  }

  // Substring Matching (Fallback for complex names like "أبيض ماربل")
  if (normalized.includes('ابيض')) return exactMatches['ابيض'];
  if (normalized.includes('بيج') || normalized.includes('عاجي') || normalized.includes('برجامون')) return exactMatches['بيج'];
  if (normalized.includes('اسود')) return exactMatches['اسود'];
  if (normalized.includes('ذهب')) return exactMatches['ذهب'];
  if (normalized.includes('فض') || normalized.includes('كروم') || normalized.includes('رمادي') || normalized.includes('رصاص')) return exactMatches['رمادي'];
  if (normalized.includes('خشب') || normalized.includes('بني')) return exactMatches['بني'];
  if (normalized.includes('ازرق') || normalized.includes('كحلي')) return exactMatches['ازرق'];
  if (normalized.includes('اخضر') || normalized.includes('زيتي')) return exactMatches['اخضر'];
  if (normalized.includes('احمر') || normalized.includes('نبيتي') || normalized.includes('عنابي')) return exactMatches['احمر'];

  // Default fallback if totally unrecognized
  return '#334155';
};
