import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Badge, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { Search, Filter, Sparkles, Layers, SlidersHorizontal, Calculator, CheckCircle2, ShieldCheck, Award, PhoneCall, XCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductSkeleton from '../components/ProductSkeleton';
import ProductModal from '../components/ProductModal';
import TileCalculatorModal from '../components/TileCalculatorModal';
import { getProducts, getCategories, getBrands } from '../services/api';

const Home = ({ settings, categoryFilter = 'الكل', setCategoryFilter, mode = 'catalog' }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [selectedSubcategory, setSelectedSubcategory] = useState('الكل');
  const [selectedBrand, setSelectedBrand] = useState('الكل');
  const [availableBrands, setAvailableBrands] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('الكل');
  const [selectedGrade, setSelectedGrade] = useState('الكل');
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false); // In-stock only filter state
  const [onSaleOnly, setOnSaleOnly] = useState(false); // On-sale only filter state
  const [availableFinishes, setAvailableFinishes] = useState([]); // Dynamic finish options
  const [availableGrades, setAvailableGrades] = useState([]); // Dynamic grade options

  // Smart Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(12);

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [calculatorProduct, setCalculatorProduct] = useState(null);
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryFilter);
    setSelectedSubcategory('الكل');
  }, [categoryFilter]);

  // Reset to page 1 whenever any filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [selectedCategory, selectedSubcategory, selectedBrand, selectedFinish, selectedGrade, searchTerm, inStockOnly, onSaleOnly, sortBy, itemsPerPage]);

  // Deep Link Parser: Automatically open modal if ?product=ID is present in URL
  useEffect(() => {
    if (products.length > 0) {
      const queryParams = new URLSearchParams(window.location.search);
      const productId = queryParams.get('product');
      if (productId) {
        const prod = products.find(p => p.id === productId || p._id === productId);
        if (prod) {
          setSelectedProduct(prod);
          setTimeout(() => {
            const grid = document.getElementById('catalog-grid');
            if (grid) {
              grid.scrollIntoView({ behavior: 'smooth' });
            }
          }, 300);
        }
      }
    }
  }, [products]);

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      setCategories([{ id: 'all', name: 'الكل', subcategories: [] }, ...res.data]);
    } catch (err) {
      console.error('Error fetching categories:', err);
    }
  };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getProducts(); // Load full master catalog
      if (Array.isArray(res.data)) {
        setProducts(res.data);
        
        // Extract dynamic filter options from master catalog
        const finishes = [...new Set(res.data.map(p => p.finish?.trim()).filter(Boolean))];
        setAvailableFinishes(finishes);
        const grades = [...new Set(res.data.map(p => p.grade?.trim()).filter(Boolean))];
        setAvailableGrades(grades);
        const brands = [...new Set(res.data.map(p => p.brand?.trim()).filter(Boolean))];
        setAvailableBrands(brands);
      } else {
        console.warn('API did not return an array:', res.data);
        setProducts([]);
      }
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('فشل في تحميل الأصناف، يرجى التأكد من تشغيل خادم البيانات Backend.');
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  // Instant Unified Multi-Filter & Search Engine
  const safeStr = (v) => (v === null || v === undefined ? '' : String(v));

  const filteredProducts = (Array.isArray(products) ? products : [])
    .filter(p => {
      try {
        if (!p || typeof p !== 'object') return false;

        // 1. Category Filter
        if (selectedCategory !== 'الكل' && safeStr(p.category) !== selectedCategory) {
          return false;
        }

        // 2. Subcategory Filter
        if (selectedSubcategory !== 'الكل' && safeStr(p.subcategory) !== selectedSubcategory) {
          return false;
        }

        // 3. Brand Filter
        if (selectedBrand !== 'الكل') {
          const brandStr = safeStr(p.brand);
          const originStr = safeStr(p.origin);
          const matchesBrand = (brandStr && brandStr === selectedBrand) || (originStr && originStr.includes(selectedBrand));
          if (!matchesBrand) return false;
        }

        // 4. Finish Filter
        if (selectedFinish !== 'الكل') {
          const finishStr = safeStr(p.finish);
          if (!finishStr || !finishStr.includes(selectedFinish)) {
            return false;
          }
        }

        // 5. Grade Filter
        if (selectedGrade !== 'الكل' && safeStr(p.grade) !== selectedGrade) {
          return false;
        }

        // 6. In-Stock Filter (variant-aware)
        if (inStockOnly) {
          const hasStock = p.hasVariants && Array.isArray(p.variants) && p.variants.length > 0
            ? p.variants.some(v => v.inStock !== false)
            : Boolean(p.inStock);
          if (!hasStock) return false;
        }

        // 7. On-Sale Filter
        if (onSaleOnly) {
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
        }

        // 8. Instant Search Term Filter (Matches name, code, category, subcategory, brand, finish, grade, dimensions, origin, description, variants)
        if (searchTerm) {
          const q = searchTerm.trim().toLowerCase();
          const nameMatch = safeStr(p.name).toLowerCase().includes(q);
          const codeMatch = safeStr(p.code).toLowerCase().includes(q);
          const catMatch = safeStr(p.category).toLowerCase().includes(q);
          const subMatch = safeStr(p.subcategory).toLowerCase().includes(q);
          const brandMatch = safeStr(p.brand).toLowerCase().includes(q);
          const dimMatch = safeStr(p.dimensions).toLowerCase().includes(q);
          const originMatch = safeStr(p.origin).toLowerCase().includes(q);
          const descMatch = safeStr(p.description).toLowerCase().includes(q);
          const variantMatch = p.variants && Array.isArray(p.variants) && p.variants.some(v => 
            safeStr(v.colorName).toLowerCase().includes(q) || safeStr(v.colorCode).toLowerCase().includes(q)
          );

          if (!nameMatch && !codeMatch && !catMatch && !subMatch && !brandMatch && !dimMatch && !originMatch && !descMatch && !variantMatch) {
            return false;
          }
        }

        return true;
      } catch (err) {
        console.error("Safely skipped corrupted product item during filter:", err, p);
        return false;
      }
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return (Number(a?.price) || 0) - (Number(b?.price) || 0);
      if (sortBy === 'priceDesc') return (Number(b?.price) || 0) - (Number(a?.price) || 0);
      
      if (mode === 'featured') {
        // Multi-Tier Strict Ranking for New & Featured Mode:
        // 1. Featured items come first
        const featA = a?.featured ? 1 : 0;
        const featB = b?.featured ? 1 : 0;
        if (featA !== featB) return featB - featA;

        // 2. On-Sale items come second (highest discount amount first)
        const discountA = Math.max(0, (Number(a?.originalPrice) || 0) - (Number(a?.price) || 0));
        const discountB = Math.max(0, (Number(b?.originalPrice) || 0) - (Number(b?.price) || 0));
        if (discountA !== discountB) return discountB - discountA;

        // 3. Newest created date
        const timeA = a?.createdAt ? new Date(a.createdAt).getTime() : 0;
        const timeB = b?.createdAt ? new Date(b.createdAt).getTime() : 0;
        if (timeA !== timeB) return timeB - timeA;

        return 0;
      }
      return 0;
    });

  const activeCategoryObj = categories.find(c => c.name === selectedCategory);
  const showSubcategories = activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0;

  return (
    <div>
      {/* Split Luxury Showroom Showcase Banner (Kohler & Porcelanosa Standard) */}
      <section className="py-3 py-md-4">
        <Container>
          <div className="split-luxury-hero">
            <Row className="g-0 align-items-center">
              {/* Right Column (RTL text & actions) */}
              <Col lg={7} className="order-2 order-lg-1">
                <div className="split-hero-content text-center text-lg-end">
                  <div className="split-hero-badge mx-auto mx-lg-0">
                    <Sparkles size={14} className="text-warning-dark" />
                    <span>
                      {mode === 'featured' 
                        ? 'التشكيلة الحصرية 2026 - الوكيل المعتمد' 
                        : (settings?.siteTitle || 'معرض السيد الجزار للسيراميك والبورسلين')
                      }
                    </span>
                  </div>

                  <h1 className="split-hero-title">
                    {mode === 'featured' ? (
                      <>أحدث <span className="text-gold">موديلات وتصاميم 2026</span> الحصرية</>
                    ) : (
                      <>أرقى تشكيلات <span className="text-gold">السيراميك والبورسلين</span> وأطقم الحمامات والخلاطات</>
                    )}
                  </h1>

                  <p className="split-hero-subtitle">
                    {settings?.siteSubtitle || 'استكشف أحدث الموديلات العالمية الإسبانية والهندية والمحلية مع تحديث فوري للأسعار وحاسبة الكراتين.'}
                  </p>

                  <div className="split-hero-trust-row justify-content-center justify-content-lg-start">
                    <span className="split-hero-trust-item">
                      <CheckCircle2 size={16} /> فرز أول ممتاز مضمون
                    </span>
                    <span className="split-hero-trust-item">
                      <CheckCircle2 size={16} /> تسليم فوري للمشروعات
                    </span>
                    <span className="split-hero-trust-item">
                      <CheckCircle2 size={16} /> أفضل الأسعار
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-2.5 justify-content-center justify-content-lg-start">
                    <Button 
                      className="btn-hero-gold"
                      onClick={() => {
                        const el = document.getElementById('catalog-grid');
                        if (el) el.scrollIntoView({ behavior: 'smooth' });
                      }}
                    >
                      <Layers size={18} />
                      تصفح الكتالوج والأسعار
                    </Button>

                    <a 
                      href={`https://wa.me/${settings?.whatsappNumber || '201012345678'}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن عروض وتصاميم المعرض')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-hero-light"
                    >
                      <PhoneCall size={18} className="text-success" />
                      طلب استشارة بالمعرض
                    </a>
                  </div>
                </div>
              </Col>

              {/* Left Column (Crystal Clear High-Res Image) */}
              <Col lg={5} className="order-1 order-lg-2">
                <div className="split-hero-img-wrap">
                  <img 
                    src="/hero_luxury_2026.jpg" 
                    alt="معرض السيد الجزار للسيراميك والبورسلين وأطقم الحمامات"
                    className="split-hero-img"
                    loading="eager"
                  />
                  <div className="split-hero-img-badge">
                    <Sparkles size={13} className="text-warning" /> تشكيلة 2026 الفاخرة
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* Filter and Search Container - LUXURY CATEGORY CHIPS & SEARCH */}
      <Container className="position-relative mb-5" id="catalog-grid">
        
        {/* Modern Category Chips Wrap Grid */}
        <div className="category-chips-grid mb-3 px-1">
          {/* 1. All Products Chip */}
          <button 
            type="button"
            className={`category-chip-pill ${selectedCategory === 'الكل' ? 'active' : ''}`}
            onClick={() => { 
              setSelectedCategory('الكل'); 
              setSelectedSubcategory('الكل'); 
              if (setCategoryFilter) setCategoryFilter('الكل'); 
            }}
          >
            <span className="chip-icon">✨</span>
            <span>جميع الأصناف (الكل)</span>
            <span className="category-chip-count">{products.length}</span>
          </button>

          {/* 2. Dynamic Category Chips */}
          {categories.filter(c => c.name !== 'الكل').map((cat) => {
            const count = products.filter(p => safeStr(p.category) === safeStr(cat.name)).length;
            const getIcon = (name) => {
              const n = String(name || '').toLowerCase();
              if (n.includes('خلاط') || n.includes('مياه')) return '🚰';
              if (n.includes('وحد') || n.includes('بانيو') || n.includes('طقم')) return '🛁';
              if (n.includes('بورسلين') || n.includes('أرضيات') || n.includes('سيراميك') || n.includes('حوائط')) return '🏛️';
              if (n.includes('شاور') || n.includes('كباين')) return '🚿';
              if (n.includes('حوض') || n.includes('مطبخ') || n.includes('ديكور')) return '🥣';
              if (n.includes('مراي') || n.includes('ليد')) return '🪞';
              if (n.includes('قواعد') || n.includes('تواليت')) return '🚽';
              return '🏷️';
            };

            return (
              <button
                key={cat.id}
                type="button"
                className={`category-chip-pill ${selectedCategory === cat.name ? 'active' : ''}`}
                onClick={() => { 
                  setSelectedCategory(cat.name); 
                  setSelectedSubcategory('الكل'); 
                  if (setCategoryFilter) setCategoryFilter(cat.name);
                }}
              >
                <span className="chip-icon">{getIcon(cat.name)}</span>
                <span>{cat.name}</span>
                {count > 0 && <span className="category-chip-count">{count}</span>}
              </button>
            );
          })}

          {/* 3. Quick Action Chips: On Sale & In Stock */}
          <button
            type="button"
            className={`category-chip-pill category-chip-sale ${onSaleOnly ? 'active' : ''}`}
            onClick={() => setOnSaleOnly(!onSaleOnly)}
          >
            <span className="chip-icon">🔥</span>
            <span>عروض وخصومات</span>
          </button>

          <button
            type="button"
            className={`category-chip-pill category-chip-instock ${inStockOnly ? 'active' : ''}`}
            onClick={() => setInStockOnly(!inStockOnly)}
          >
            <span className="chip-icon">🟢</span>
            <span>المتوفر بالمخزن</span>
          </button>
        </div>

        {/* Dynamic Subcategories Row (if active) */}
        {showSubcategories && (
          <div className="subcategories-bar-luxury mb-4 animate-fade-in">
            <span className="text-muted fw-bold d-flex align-items-center gap-1 me-1" style={{ fontSize: '0.85rem' }}>
              <Sparkles size={14} className="text-warning" /> الأنواع:
            </span>
            <button
              type="button"
              className={`category-chip-pill ${selectedSubcategory === 'الكل' ? 'active' : ''}`}
              style={{ padding: '6px 14px', fontSize: '0.82rem' }}
              onClick={() => setSelectedSubcategory('الكل')}
            >
              الكل
            </button>
            {activeCategoryObj.subcategories.map((sub, sIdx) => (
              <button
                key={sIdx}
                type="button"
                className={`category-chip-pill ${selectedSubcategory === sub ? 'active' : ''}`}
                style={{ padding: '6px 14px', fontSize: '0.82rem' }}
                onClick={() => setSelectedSubcategory(sub)}
              >
                {sub}
              </button>
            ))}
          </div>
        )}

        {/* The Floating Search Engine */}
        <div className="floating-search-wrapper d-flex flex-column flex-md-row align-items-md-center">
          
          {/* Main Search Input */}
          <div className="flex-grow-1 position-relative d-flex align-items-center">
            <Search size={22} className="text-muted ms-3" />
            <input 
              type="text" 
              className="form-control luxury-search-input w-100"
              placeholder="ابحث بالاسم، الكود، المقاس، أو بلد المنشأ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {/* Live Search Dropdown */}
            {searchTerm && searchTerm.trim().length > 0 && (
              <div 
                className="position-absolute w-100 bg-white border rounded-4 shadow-lg z-index-dropdown"
                style={{ top: '100%', left: 0, marginTop: '15px', zIndex: 1050, maxHeight: '350px', overflowY: 'auto' }}
              >
                {filteredProducts.slice(0, 5).map((prod) => (
                  <div 
                    key={prod.id} 
                    className="d-flex align-items-center gap-3 p-3 border-bottom cursor-pointer hover-bg-light transition-all"
                    style={{ cursor: 'pointer' }}
                    onClick={() => {
                      setSelectedProduct(prod);
                      setSearchTerm('');
                    }}
                  >
                    <img 
                      src={(prod.images && prod.images.length > 0) ? prod.images[0] : (prod.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=100&q=80')} 
                      alt={prod.name} 
                      className="rounded-3 shadow-sm"
                      style={{ width: '48px', height: '48px', objectFit: 'cover' }}
                    />
                    <div>
                      <div className="fw-bold text-dark fs-7 lh-sm mb-1">{prod.name}</div>
                      <div className="text-muted small fs-8">الكود: {prod.code}</div>
                    </div>
                  </div>
                ))}
                {filteredProducts.length === 0 && (
                  <div className="p-4 text-center text-muted small fw-bold">
                    لا يوجد نتائج مطابقة للبحث
                  </div>
                )}
                {filteredProducts.length > 5 && (
                  <div className="p-3 text-center text-primary small fw-bold bg-light">
                    عرض باقي النتائج ({filteredProducts.length - 5}+) في الشبكة بالأسفل 👇
                  </div>
                )}
              </div>
            )}
          </div>

          <div className="search-divider d-none d-md-block"></div>

          {/* Brand Dropdown (Integrated) */}
          <div className="d-flex align-items-center mt-3 mt-md-0 px-2 px-md-0">
            <Award size={20} className="text-warning ms-2" />
            <select 
              className="form-select search-brand-select"
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
            >
              <option value="الكل">جميع الماركات العالمية والمحلية</option>
              {availableBrands.map((b, idx) => (
                <option key={idx} value={b}>{b}</option>
              ))}
            </select>
          </div>

          <div className="search-divider d-none d-md-block"></div>

          {/* Advanced Filters Toggle Button */}
          <div className="mt-3 mt-md-0 ms-md-2 d-flex justify-content-between align-items-center gap-2">
            <button 
              className={`advanced-filters-btn d-flex align-items-center gap-2 ${showMobileFilters ? 'active' : ''}`}
              onClick={() => setShowMobileFilters(!showMobileFilters)}
            >
              <SlidersHorizontal size={18} />
              فلاتر متقدمة
              {/* Badge for active advanced filters */}
              {[selectedFinish !== 'الكل', selectedGrade !== 'الكل', inStockOnly, onSaleOnly].filter(Boolean).length > 0 && (
                <span className="badge bg-danger rounded-circle ms-1">
                  {[selectedFinish !== 'الكل', selectedGrade !== 'الكل', inStockOnly, onSaleOnly].filter(Boolean).length}
                </span>
              )}
            </button>
            
            {/* Reset All Button */}
            {(selectedCategory !== 'الكل' || selectedSubcategory !== 'الكل' || selectedBrand !== 'الكل' || selectedFinish !== 'الكل' || selectedGrade !== 'الكل' || searchTerm !== '' || inStockOnly || onSaleOnly) && (
              <Button 
                variant="light" 
                className="rounded-circle p-2 text-danger border shadow-sm"
                title="إعادة تعيين جميع الفلاتر"
                onClick={() => {
                  setSelectedCategory('الكل');
                  setSelectedSubcategory('الكل');
                  setSelectedBrand('الكل');
                  setSelectedFinish('الكل');
                  setSelectedGrade('الكل');
                  setSearchTerm('');
                  setInStockOnly(false);
                  setOnSaleOnly(false);
                  if (setCategoryFilter) setCategoryFilter('الكل');
                }}
              >
                <XCircle size={20} />
              </Button>
            )}
          </div>
        </div>

        {/* Collapsible Advanced Filters Panel */}
        {showMobileFilters && (
          <div className="advanced-filters-panel mt-4 position-relative" style={{ zIndex: 9 }}>
            <Row className="g-4 align-items-center">
              {/* Finish Filter */}
              <Col md={3}>
                <Form.Label className="fw-bold small text-muted mb-2">اللمعة والتشطيب</Form.Label>
                <Form.Select 
                  value={selectedFinish}
                  onChange={(e) => setSelectedFinish(e.target.value)}
                  className="custom-input bg-light border-0"
                >
                  <option value="الكل">جميع اللمعات والتشطيبات</option>
                  {availableFinishes.map((f, idx) => (
                    <option key={idx} value={f}>{f}</option>
                  ))}
                </Form.Select>
              </Col>

              {/* Grade Filter */}
              <Col md={3}>
                <Form.Label className="fw-bold small text-muted mb-2">درجة الفرز</Form.Label>
                <Form.Select 
                  value={selectedGrade}
                  onChange={(e) => setSelectedGrade(e.target.value)}
                  className="custom-input bg-light border-0"
                >
                  <option value="الكل">جميع درجات الفرز</option>
                  {availableGrades.map((g, idx) => (
                    <option key={idx} value={g}>{g}</option>
                  ))}
                </Form.Select>
              </Col>

              {/* Sort Dropdown */}
              <Col md={3}>
                <Form.Label className="fw-bold small text-muted mb-2">ترتيب عرض المنتجات</Form.Label>
                <Form.Select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="custom-input bg-light border-0"
                >
                  <option value="newest">الأحدث مبيعا بالمعرض</option>
                  <option value="priceAsc">الأقل سعراً للمتر أولاً</option>
                  <option value="priceDesc">الأعلى سعراً (الفخامة الفائقة)</option>
                </Form.Select>
              </Col>

              {/* Toggles */}
              <Col md={3}>
                <Form.Label className="fw-bold small text-muted mb-2">تصفية سريعة</Form.Label>
                <div className="d-flex flex-column gap-2">
                  <Form.Check 
                    type="switch"
                    id="instock-toggle"
                    label="الأصناف المتوفرة بالمخزن"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="fw-bold text-dark modern-toggle"
                  />
                  <Form.Check 
                    type="switch"
                    id="onsale-toggle"
                    label="🔥 عروض وخصومات حصرياً"
                    checked={onSaleOnly}
                    onChange={(e) => setOnSaleOnly(e.target.checked)}
                    className="fw-bold text-danger modern-toggle sale-toggle"
                  />
                </div>
              </Col>
            </Row>
          </div>
        )}
      </Container>

      {/* Main Catalog Grid Section */}
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">
              {mode === 'featured' 
                ? '🔥 التشكيلة الجديدة وأحدث الأصناف 2026'
                : searchTerm.trim() 
                  ? `🔍 نتائج البحث عن: "${searchTerm}"`
                  : onSaleOnly 
                    ? '🔥 عروض وخصومات المعرض الحصرية'
                    : selectedCategory !== 'الكل'
                      ? `✨ كتالوج معروضات ${selectedCategory}`
                      : '🏛️ كتالوج السيراميك والبورسلين وأطقم الحمامات والخلاطات'
              }
            </h3>
            <p className="text-muted small mb-0">
              {mode === 'featured' 
                ? `معروض حالياً أحدث (${filteredProducts.length}) صنف واصل حديثاً للمعرض` 
                : searchTerm.trim()
                  ? `تم العثور على (${filteredProducts.length}) صنف مطابق لبحثك`
                  : onSaleOnly
                    ? `معروض حالياً (${filteredProducts.length}) صنف عليها تخفيضات وعروض خاصة`
                    : selectedCategory !== 'الكل'
                      ? `معروض حالياً (${filteredProducts.length}) صنف في قسم ${selectedCategory} بالأسعار والمواصفات الكاملة`
                      : `معروض حالياً (${filteredProducts.length}) صنف تشمل السيراميك، البورسلين، أطقم الحمامات، الخلاطات، وكافة الديكورات`
              }
            </p>
          </div>
        </div>

        {error && (
          <Alert variant="danger" className="rounded-4">
            {error}
          </Alert>
        )}

        {loading ? (
          <Row className="g-2 g-sm-3 g-lg-4 mb-5">
            {[...Array(8)].map((_, idx) => (
              <Col key={idx} xs={6} md={4} lg={4} xl={3}>
                <ProductSkeleton index={idx} />
              </Col>
            ))}
          </Row>
        ) : filteredProducts.length === 0 ? (
          <div className="no-results-card text-center py-5 p-5 shadow-sm rounded-4 border bg-white position-relative overflow-hidden">
            <div className="no-results-bg-glow"></div>
            <div className="position-relative z-1">
              <div className="no-results-icon-wrapper mx-auto mb-4 bg-light rounded-circle d-flex align-items-center justify-content-center" style={{ width: '80px', height: '80px' }}>
                <Search size={36} className="text-warning animate-bounce" />
              </div>
              <h4 className="fw-bold text-dark mb-2">عذراً، لم نجد أي أصناف تطابق فلاتر البحث الحالية</h4>
              <p className="text-muted mx-auto mb-4" style={{ maxWidth: '480px', fontSize: '0.9rem' }}>
                جرب تغيير كلمات البحث، أو قم بإلغاء بعض الفلاتر النشطة لإظهار المزيد من السيراميك والبورسلين الفاخر بالمعرض.
              </p>
              <Button 
                variant="warning"
                className="px-4 py-2.5 fw-bold text-dark rounded-pill shadow-sm"
                onClick={() => {
                  setSelectedCategory('الكل');
                  setSelectedSubcategory('الكل');
                  setSelectedFinish('الكل');
                  setSelectedGrade('الكل');
                  setSearchTerm('');
                  setInStockOnly(false);
                  setOnSaleOnly(false);
                  if (setCategoryFilter) setCategoryFilter('الكل');
                }}
              >
                🔄 إعادة تعيين كافة الفلاتر والبحث
              </Button>
            </div>
          </div>
        ) : (
          <>
            {/* Active Brand Filter Banner */}
            {selectedBrand !== 'الكل' && (
              <div className="alert alert-warning border-2 rounded-4 shadow-sm d-flex align-items-center justify-content-between p-3 mb-4 animate-fade-in">
                <div className="d-flex align-items-center gap-2">
                  <span className="fs-5">🏷️</span>
                  <span className="fw-bold text-dark">
                    تعرض الآن أصناف وموديلات ماركة: <strong className="text-warning-dark fs-5">{selectedBrand}</strong> ({filteredProducts.length} صنف متوفر)
                  </span>
                </div>
                <Button 
                  variant="outline-dark" 
                  size="sm" 
                  className="rounded-pill fw-bold"
                  onClick={() => setSelectedBrand('الكل')}
                >
                  ✖️ إظهار كافة الماركات
                </Button>
              </div>
            )}

            {/* Calculate Paginated Products */}
            {(() => {
              const perPage = itemsPerPage === 'all' ? filteredProducts.length : Number(itemsPerPage);
              const totalPages = Math.max(1, Math.ceil(filteredProducts.length / perPage));
              const safePage = Math.min(currentPage, totalPages);
              const startIndex = (safePage - 1) * perPage;
              const paginatedProducts = itemsPerPage === 'all' 
                ? filteredProducts 
                : filteredProducts.slice(startIndex, startIndex + perPage);

              return (
                <>
                  <Row className="g-2 g-sm-3 g-lg-4">
                    {paginatedProducts.map((product) => (
                      <Col key={product.id} xs={6} md={4} lg={4} xl={3}>
                        <ProductCard 
                          product={product} 
                          onSelectProduct={(p) => setSelectedProduct(p)}
                          onOpenCalculator={(p) => setCalculatorProduct(p)}
                          settings={settings}
                          onSelectBrand={(brandName) => {
                            setSelectedBrand(brandName);
                            const grid = document.getElementById('catalog-grid');
                            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                          }}
                        />
                      </Col>
                    ))}
                  </Row>

                  {/* Luxury Pagination Control Bar */}
                  {filteredProducts.length > 0 && (itemsPerPage !== 'all' && totalPages > 1) && (
                    <div className="d-flex flex-column flex-md-row align-items-center justify-content-between gap-3 mt-5 pt-4 border-top animate-fade-in">
                      <div className="text-muted small fw-bold text-center text-md-start">
                        عرض الأصناف من <strong className="text-dark">{startIndex + 1}</strong> إلى <strong className="text-dark">{Math.min(startIndex + perPage, filteredProducts.length)}</strong> من إجمالي <strong className="text-warning-dark fs-6">{filteredProducts.length}</strong> صنف
                      </div>

                      <div className="d-flex align-items-center gap-1.5 flex-wrap justify-content-center">
                        {/* Previous Button */}
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled={safePage === 1}
                          onClick={() => {
                            setCurrentPage(prev => Math.max(1, prev - 1));
                            const grid = document.getElementById('catalog-grid');
                            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="rounded-pill px-3 fw-bold"
                        >
                          ← السابقة
                        </Button>

                        {/* Page Numbers */}
                        {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                          <Button
                            key={page}
                            variant={safePage === page ? 'warning' : 'outline-light'}
                            size="sm"
                            onClick={() => {
                              setCurrentPage(page);
                              const grid = document.getElementById('catalog-grid');
                              if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                            }}
                            className={`rounded-circle px-3 py-1.5 fw-bold ${safePage === page ? 'text-dark shadow-sm' : 'text-dark border'}`}
                            style={{ width: '38px', height: '38px', display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}
                          >
                            {page}
                          </Button>
                        ))}

                        {/* Next Button */}
                        <Button
                          variant="outline-secondary"
                          size="sm"
                          disabled={safePage === totalPages}
                          onClick={() => {
                            setCurrentPage(prev => Math.min(totalPages, prev + 1));
                            const grid = document.getElementById('catalog-grid');
                            if (grid) grid.scrollIntoView({ behavior: 'smooth' });
                          }}
                          className="rounded-pill px-3 fw-bold"
                        >
                          التالية →
                        </Button>
                      </div>

                      {/* Items Per Page Selector */}
                      <div className="d-flex align-items-center gap-2">
                        <span className="text-muted small fw-bold">الأصناف بالصفحة:</span>
                        <Form.Select
                          size="sm"
                          value={itemsPerPage}
                          onChange={(e) => {
                            setItemsPerPage(e.target.value === 'all' ? 'all' : Number(e.target.value));
                            setCurrentPage(1);
                          }}
                          className="rounded-3 border-secondary custom-input items-per-page-select py-1"
                        >
                          <option value={12}>12</option>
                          <option value={24}>24</option>
                          <option value={48}>48</option>
                          <option value="all">الكل</option>
                        </Form.Select>
                      </div>
                    </div>
                  )}
                </>
              );
            })()}
          </>
        )}
      </Container>

      {/* Product Detail Modal */}
      <ProductModal 
        product={selectedProduct}
        show={!!selectedProduct}
        onHide={() => setSelectedProduct(null)}
        settings={settings}
        onOpenCalculator={(p) => setCalculatorProduct(p)}
        onSelectBrand={(brandName) => {
          setSelectedBrand(brandName);
          setTimeout(() => {
            const el = document.getElementById('catalog-grid');
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 200);
        }}
      />

      {/* Tile & Cartons Calculator Modal */}
      <TileCalculatorModal
        product={calculatorProduct}
        show={!!calculatorProduct}
        onHide={() => setCalculatorProduct(null)}
        settings={settings}
      />
    </div>
  );
};

export default Home;
