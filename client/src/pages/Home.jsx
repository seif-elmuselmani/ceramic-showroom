import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Badge, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { Search, Filter, Sparkles, Layers, SlidersHorizontal, Calculator, CheckCircle2, ShieldCheck, Award, PhoneCall, XCircle } from 'lucide-react';
import ProductCard from '../components/ProductCard';
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

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [calculatorProduct, setCalculatorProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
    fetchProducts();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryFilter);
    setSelectedSubcategory('الكل');
  }, [categoryFilter]);

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

        // 6. In-Stock Filter
        if (inStockOnly && !p.inStock) {
          return false;
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

        // 8. Instant Search Term Filter (Matches name, code, category, subcategory, brand, finish, grade, dimensions, origin, description)
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

          if (!nameMatch && !codeMatch && !catMatch && !subMatch && !brandMatch && !dimMatch && !originMatch && !descMatch) {
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
        // Dynamic Multi-Factor Ranking Engine for scalable MongoDB/Database products
        const scoreA = (a?.featured ? 100000 : 0) + (Number(a?.originalPrice) > Number(a?.price) ? 50000 : 0) + (a?.createdAt ? new Date(a.createdAt).getTime() : 0);
        const scoreB = (b?.featured ? 100000 : 0) + (Number(b?.originalPrice) > Number(b?.price) ? 50000 : 0) + (b?.createdAt ? new Date(b.createdAt).getTime() : 0);
        if (scoreA !== scoreB) return scoreB - scoreA;
      }
      return 0;
    });

  const activeCategoryObj = categories.find(c => c.name === selectedCategory);
  const showSubcategories = activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0;

  return (
    <div>
      {/* Hero Banner Section with Dynamic Mode Styling */}
      <section className="hero-section text-center text-md-end">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <Badge bg="warning" text="dark" className="px-3 py-2 fs-6 mb-3 fw-bold shadow-sm">
                {mode === 'featured' 
                  ? '🔥 التشكيلة الحصرية 2026 - أحدث موديلات السيراميك والبورسلين الواصلة حديثاً للمعرض' 
                  : '✨ الوكيل المعتمد لأحدث ماركات السيراميك والبورسلين العالمية والمحلية'
                }
              </Badge>
              <h1 className="hero-title">
                {mode === 'featured' ? (
                  <>أحدث <span>تصاميم وموديلات 2026</span> الواصلة حديثاً</>
                ) : (
                  <>فخامة <span>السيراميك والبورسلين</span> في مكان واحد بأفضل الأسعار</>
                )}
              </h1>
              <p className="hero-subtitle">
                {mode === 'featured' 
                  ? 'استكشف التشكيلة الجديدة الفاخرة الواصلة حديثاً لمعارض الجزار من أرقى البورسلين الهندي والإسباني وسيراميك الأرضيات والحوائط ذات المظهر العصري 2026.'
                  : 'تصفح الكتالوج المباشر لأرقى الأصناف الإسبانية والإيطالية والمحلية (كليوباترا، الجوهرة، رويال، فينيسيا) مع تحديث فوري للأسعار وحاسبة الأمتار والكراتين.'
                }
              </p>
              
              <div className="d-flex flex-wrap gap-3 mt-4">
                <Button 
                  className="admin-btn py-3 px-4 fs-6"
                  onClick={() => {
                    const el = document.getElementById('catalog-grid');
                    if (el) el.scrollIntoView({ behavior: 'smooth' });
                  }}
                >
                  <Layers size={20} className="me-2" />
                  تصفح الكتالوج والأسعار
                </Button>

                <a 
                  href={`https://wa.me/${settings?.whatsappNumber || '201012345678'}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="btn btn-outline-light rounded-pill py-3 px-4 fw-bold fs-6 border-2"
                >
                  <PhoneCall size={20} className="me-2" />
                  طلب معاينة عينات بالمعرض
                </a>
              </div>
            </Col>
            
            <Col lg={5} className="mt-4 mt-lg-0">
              <Row className="g-3">
                <Col xs={6} sm={6}>
                  <div className="stat-badge">
                    <Sparkles size={24} className="text-warning mb-1 opacity-90" />
                    <div className="stat-number">+1000</div>
                    <div className="stat-label">تصميم صنف فريد بالمعرض</div>
                  </div>
                </Col>
                <Col xs={6} sm={6}>
                  <div className="stat-badge">
                    <CheckCircle2 size={24} className="text-warning mb-1 opacity-90" />
                    <div className="stat-number">100%</div>
                    <div className="stat-label">فرز أول ممتاز مضمون</div>
                  </div>
                </Col>
                <Col xs={6} sm={6}>
                  <div className="stat-badge">
                    <Award size={24} className="text-warning mb-1 opacity-90" />
                    <div className="stat-number">60x120</div>
                    <div className="stat-label">أحجام بورسلين عملاقة</div>
                  </div>
                </Col>
                <Col xs={6} sm={6}>
                  <div className="stat-badge">
                    <Calculator size={24} className="text-warning mb-1 opacity-90" />
                    <div className="stat-number">حاسبة</div>
                    <div className="stat-label">حساب الكراتين تلقائياً</div>
                  </div>
                </Col>
              </Row>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Filter and Search Container */}
      <Container className="mb-5" id="catalog-grid">
        <div className="filter-card">
          {/* Brand Filter Bar Header */}
          {availableBrands.length > 0 && (
            <div className="mb-4 pb-3 border-bottom">
              <div className="d-flex justify-content-between align-items-center mb-2.5 flex-wrap gap-2">
                <span className="fw-bold text-dark small d-flex align-items-center gap-1.5">
                  <Award size={18} className="text-warning" />
                  <span>🏛️ التصفح حسب الماركة والعلامة التجارية:</span>
                </span>
                {selectedBrand !== 'الكل' && (
                  <Button 
                    size="sm" 
                    variant="outline-danger" 
                    className="rounded-pill px-3 py-1 text-nowrap small fw-bold"
                    onClick={() => setSelectedBrand('الكل')}
                  >
                    إلغاء فلتر الماركة (عرض الجميع)
                  </Button>
                )}
              </div>
              
              <div className="d-flex gap-2 flex-wrap align-items-center">
                <button 
                  type="button"
                  className={`brand-chip-pill ${selectedBrand === 'الكل' ? 'active' : ''}`}
                  onClick={() => setSelectedBrand('الكل')}
                >
                  جميع الماركات
                </button>

                {availableBrands.map((b, idx) => (
                  <button
                    type="button"
                    key={idx}
                    className={`brand-chip-pill ${selectedBrand === b ? 'active' : ''}`}
                    onClick={() => setSelectedBrand(b)}
                  >
                    🏷️ {b}
                  </button>
                ))}
              </div>
            </div>
          )}

          <Row className="g-3 align-items-center">
            {/* Search Input */}
            <Col md={4}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <Search size={20} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="ابحث بالاسم، الكود، المقاس، أو بلد المنشأ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="custom-input border-start-0"
                />
              </InputGroup>
            </Col>

            {/* Finish Filter (Dynamic) */}
            <Col sm={6} md={3}>
              <Form.Select 
                value={selectedFinish}
                onChange={(e) => setSelectedFinish(e.target.value)}
                className="custom-input"
              >
                <option value="الكل">جميع اللمعات والتشطيبات</option>
                {availableFinishes.map((f, idx) => (
                  <option key={idx} value={f}>{f}</option>
                ))}
              </Form.Select>
            </Col>

            {/* Grade Filter (Dynamic) */}
            <Col sm={6} md={2}>
              <Form.Select 
                value={selectedGrade}
                onChange={(e) => setSelectedGrade(e.target.value)}
                className="custom-input"
              >
                <option value="الكل">جميع درجات الفرز</option>
                {availableGrades.map((g, idx) => (
                  <option key={idx} value={g}>{g}</option>
                ))}
              </Form.Select>
            </Col>

            {/* Sort Dropdown */}
            <Col sm={6} md={3}>
              <Form.Select 
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="custom-input"
              >
                <option value="newest">الترتيب: الأحدث مبيعا بالمعرض</option>
                <option value="priceAsc">الترتيب: الأقل سعراً للمتر أولاً</option>
                <option value="priceDesc">الترتيب: الأعلى سعراً (الفخامة الفائقة)</option>
              </Form.Select>
            </Col>
          </Row>

          {/* Active Filters Summary, In-Stock Toggle, & Reset Button */}
          <div className="d-flex flex-wrap justify-content-between align-items-center mt-3 pt-3 border-top gap-3">
            {/* Left side: Live results badge & In-stock Toggle */}
            <div className="d-flex align-items-center gap-3 flex-wrap">
              {/* Live Results Count Badge */}
              <Badge bg="warning" text="dark" className="px-3 py-2 rounded-pill fw-bold fs-7 shadow-sm d-flex align-items-center gap-1">
                <span>🔍</span>
                <span>تم العثور على {filteredProducts.length} صنف</span>
              </Badge>

              {/* In-Stock Only Toggle Switch */}
              <Form.Check 
                type="switch"
                id="instock-toggle"
                label="الأصناف المتوفرة بالمخزن فقط"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="fw-bold text-dark cursor-pointer mb-0 me-2"
              />

              {/* On-Sale Only Toggle Switch */}
              <Form.Check 
                type="switch"
                id="onsale-toggle"
                label="🔥 عروض وخصومات حصرياً"
                checked={onSaleOnly}
                onChange={(e) => setOnSaleOnly(e.target.checked)}
                className="fw-bold text-danger cursor-pointer mb-0"
              />
            </div>

            {/* Right side: Reset Filters Button (Appears dynamically if any filter is set) */}
            {(selectedCategory !== 'الكل' || selectedSubcategory !== 'الكل' || selectedBrand !== 'الكل' || selectedFinish !== 'الكل' || selectedGrade !== 'الكل' || searchTerm !== '' || inStockOnly || onSaleOnly) && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="d-flex align-items-center gap-1 fw-bold px-3 py-1.5 rounded-pill shadow-sm"
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
                <XCircle size={16} />
                <span>إعادة تعيين جميع الفلاتر</span>
                <span className="badge bg-danger text-white rounded-circle ms-1">
                  {[selectedCategory !== 'الكل', selectedSubcategory !== 'الكل', selectedBrand !== 'الكل', selectedFinish !== 'الكل', selectedGrade !== 'الكل', searchTerm !== '', inStockOnly, onSaleOnly].filter(Boolean).length}
                </span>
              </Button>
            )}
          </div>

          {/* Category Chips (Horizontally scrollable on mobile for better space usage) */}
          <div className="d-flex align-items-center mt-4 pt-3 border-top overflow-hidden">
            <span className="text-muted fw-bold d-flex align-items-center gap-1 me-3 flex-shrink-0">
              <Layers size={18} /> الفئات:
            </span>
            <div className="category-scroll-container flex-grow-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  className={`category-chip ${selectedCategory === cat.name ? 'active' : ''}`}
                  onClick={() => { 
                    setSelectedCategory(cat.name); 
                    setSelectedSubcategory('الكل'); 
                    if (setCategoryFilter) setCategoryFilter(cat.name);
                  }}
                >
                  {cat.name}
                </button>
              ))}
            </div>
          </div>

          {/* Subcategory Chips */}
          {showSubcategories && (
            <div className="d-flex align-items-center mt-3 pt-3 border-top overflow-hidden animate-fade-in">
              <span className="text-muted fw-bold d-flex align-items-center gap-1 me-3 flex-shrink-0" style={{ fontSize: '0.9rem' }}>
                <Sparkles size={16} className="text-warning" /> الأنواع:
              </span>
              <div className="category-scroll-container flex-grow-1">
                <button
                  className={`category-chip ${selectedSubcategory === 'الكل' ? 'active' : ''}`}
                  onClick={() => setSelectedSubcategory('الكل')}
                >
                  الكل
                </button>
                {activeCategoryObj.subcategories.map((sub, sIdx) => (
                  <button
                    key={sIdx}
                    className={`category-chip ${selectedSubcategory === sub ? 'active' : ''}`}
                    onClick={() => setSelectedSubcategory(sub)}
                  >
                    {sub}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </Container>

      {/* Main Catalog Grid Section */}
      <Container>
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h3 className="fw-bold text-dark mb-1">
              {mode === 'featured' ? '🔥 التشكيلة الجديدة وأحدث الأصناف 2026' : '📐 كتالوج أصناف السيراميك والبورسلين بالمعرض'}
            </h3>
            <p className="text-muted small mb-0">
              {mode === 'featured' 
                ? `معروض حالياً أحدث (${filteredProducts.length}) صنف واصل حديثاً للمعرض` 
                : `معروض حالياً (${filteredProducts.length}) صنف مع الأسعار المحدثة وحاسبة الكراتين`
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
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-muted mt-3 fw-bold">جاري استدعاء الأصناف والأسعار المحدثة...</p>
          </div>
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

            <Row className="g-4">
              {filteredProducts.map((product) => (
                <Col key={product.id} sm={6} lg={4} xl={3}>
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
