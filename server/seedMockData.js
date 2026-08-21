require('dotenv').config();
const db = require('./db');

const mockProducts = [
  {
    name: 'طقم حمام كليوباترا فاخر T-100',
    category: 'أطقم حمامات',
    subcategory: 'كليوباترا',
    price: 3500,
    originalPrice: 4200,
    unit: 'طقم',
    inStock: true,
    featured: true,
    description: 'طقم حمام متكامل مكون من مرحاض، حوض، وخلاط. مثالي للمساحات المتوسطة.',
    code: 'T-100-CL',
    hasVariants: true,
    variants: [
      { color: 'أبيض', coverType: 'عادي', price: 3500, originalPrice: 4200, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
      { color: 'أبيض', coverType: 'هيدروليك', price: 3800, originalPrice: 4500, image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800' },
      { color: 'أسود', coverType: 'هيدروليك', price: 4200, originalPrice: 5000, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800' },
      { color: 'برجامون', coverType: 'عادي', price: 3600, originalPrice: 4300, image: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&q=80&w=800' },
    ],
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'بورسلين هندي لامع ممتاز T-200',
    category: 'بورسلين مستورد',
    subcategory: 'هندي',
    price: 450,
    originalPrice: 550,
    unit: 'م2',
    inStock: true,
    featured: false,
    description: 'بورسلين هندي عالي الجودة بمقاس 60x120، لمسة نهائية لامعة جداً.',
    code: 'T-200-IN',
    hasVariants: false,
    variants: [],
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'سيراميك أرضيات خشبي T-300',
    category: 'سيراميك أرضيات',
    subcategory: 'فرز أول',
    price: 180,
    originalPrice: 200,
    unit: 'م2',
    inStock: false,
    featured: true,
    description: 'سيراميك أرضيات بشكل الخشب الطبيعي، يضفي دفئاً على المكان. غير متوفر حالياً.',
    code: 'T-300-WD',
    hasVariants: false,
    variants: [],
    image: 'https://images.unsplash.com/photo-1516455590571-18256e5bb9ff?auto=format&fit=crop&q=80&w=800'
  },
  {
    name: 'وحدة حوض ديكورية مودرن T-400',
    category: 'وحدات وأحواض',
    subcategory: 'وحدات خشبية',
    price: 6500,
    originalPrice: 7200,
    unit: 'وحدة',
    inStock: true,
    featured: true,
    description: 'وحدة حوض مع مرآة بإضاءة ليد خلفية وتصميم عصري.',
    code: 'T-400-UN',
    hasVariants: true,
    variants: [
      { color: 'خشب طبيعي', coverType: '', price: 6500, originalPrice: 7200, image: 'https://images.unsplash.com/photo-1595514535415-84955b4104bd?auto=format&fit=crop&q=80&w=800' },
      { color: 'أبيض لاكيه', coverType: '', price: 6800, originalPrice: 7500, image: 'https://images.unsplash.com/photo-1595514535415-84955b4104bd?auto=format&fit=crop&q=80&w=800' }
    ],
    image: 'https://images.unsplash.com/photo-1595514535415-84955b4104bd?auto=format&fit=crop&q=80&w=800'
  }
];

async function seed() {
  console.log("Starting seed process...");
  for (const product of mockProducts) {
    try {
      await db.addProduct(product);
      console.log(`Added: ${product.name}`);
    } catch (err) {
      console.error(`Failed to add ${product.name}:`, err);
    }
  }
  console.log("Seeding complete!");
  process.exit(0);
}

seed();
