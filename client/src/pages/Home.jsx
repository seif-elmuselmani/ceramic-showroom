import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Form, InputGroup, Badge, Spinner, Alert, Card, Button } from 'react-bootstrap';
import { Search, Filter, Sparkles, Layers, SlidersHorizontal, Calculator, CheckCircle2, ShieldCheck, Award, PhoneCall } from 'lucide-react';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';
import TileCalculatorModal from '../components/TileCalculatorModal';
import { getProducts, getCategories } from '../services/api';

const Home = ({ settings, categoryFilter = 'الكل', setCategoryFilter }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters state
  const [selectedCategory, setSelectedCategory] = useState(categoryFilter);
  const [selectedSubcategory, setSelectedSubcategory] = useState('الكل');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedFinish, setSelectedFinish] = useState('الكل');
  const [selectedGrade, setSelectedGrade] = useState('الكل');
  const [sortBy, setSortBy] = useState('newest');
  const [inStockOnly, setInStockOnly] = useState(false); // In-stock only filter state

  // Modal States
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [calculatorProduct, setCalculatorProduct] = useState(null);

  useEffect(() => {
    fetchCategories();
  }, []);

  useEffect(() => {
    setSelectedCategory(categoryFilter);
    setSelectedSubcategory('الكل');
  }, [categoryFilter]);

  useEffect(() => {
    fetchProducts();
  }, [selectedCategory, selectedSubcategory, selectedFinish, selectedGrade, inStockOnly]);

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
      const params = {};
      if (selectedCategory !== 'الكل') params.category = selectedCategory;
      if (selectedSubcategory !== 'الكل') params.subcategory = selectedSubcategory;
      if (selectedFinish !== 'الكل') params.finish = selectedFinish;
      if (selectedGrade !== 'الكل') params.grade = selectedGrade;
      if (inStockOnly) params.inStock = 'true';
      
      const res = await getProducts(params);
      setProducts(res.data);
    } catch (err) {
      console.error('Error fetching products:', err);
      setError('فشل في تحميل الأصناف، يرجى التأكد من تشغيل خادم البيانات Backend.');
    } finally {
      setLoading(false);
    }
  };

  // Filter & Sort locally by search query
  const filteredProducts = products
    .filter(p => {
      if (!searchTerm) return true;
      const q = searchTerm.toLowerCase();
      return (
        p.name.toLowerCase().includes(q) ||
        p.code.toLowerCase().includes(q) ||
        (p.dimensions && p.dimensions.includes(q)) ||
        (p.origin && p.origin.toLowerCase().includes(q)) ||
        (p.description && p.description.toLowerCase().includes(q))
      );
    })
    .sort((a, b) => {
      if (sortBy === 'priceAsc') return a.price - b.price;
      if (sortBy === 'priceDesc') return b.price - a.price;
      return 0;
    });

  const activeCategoryObj = categories.find(c => c.name === selectedCategory);
  const showSubcategories = activeCategoryObj && activeCategoryObj.subcategories && activeCategoryObj.subcategories.length > 0;

  return (
    <div>
      {/* Hero Banner Section with Luxury Styling */}
      <section className="hero-section text-center text-md-end">
        <Container>
          <Row className="align-items-center">
            <Col lg={7}>
              <Badge bg="warning" text="dark" className="px-3 py-2 fs-6 mb-3 fw-bold shadow-sm">
                ✨ الوكيل المعتمد لأحدث ماركات السيراميك والبورسلين العالمية والمحلية
              </Badge>
              <h1 className="hero-title">
                فخامة <span>السيراميك والبورسلين</span> في مكان واحد بأفضل الأسعار
              </h1>
              <p className="hero-subtitle">
                تصفح الكتالوج المباشر لأرقى الأصناف الإسبانية والإيطالية والمحلية (كليوباترا، الجوهرة، رويال، فينيسيا) مع تحديث فوري للأسعار وحاسبة الأمتار والكراتين.
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
                    <div className="stat-number">+1000</div>
                    <div className="stat-label">تصميم صنف فريد بالمعرض</div>
                  </div>
                </Col>
                <Col xs={6} sm={6}>
                  <div className="stat-badge">
                    <div className="stat-number">100%</div>
                    <div className="stat-label">فرز أول ممتاز مضمون</div>
                  </div>
                </Col>
                <Col xs={6} sm={6}>
                  <div className="stat-badge">
                    <div className="stat-number">60x120</div>
                    <div className="stat-label">أحجام بورسلين عملاقة</div>
                  </div>
                </Col>
                <Col xs={6} sm={6}>
                  <div className="stat-badge">
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
          <Row className="g-3 align-items-center">
            {/* Search Input */}
            <Col md={5}>
              <InputGroup>
                <InputGroup.Text className="bg-light border-end-0">
                  <Search size={20} className="text-muted" />
                </InputGroup.Text>
                <Form.Control
                  type="text"
                  placeholder="ابحث بالاسم، الكود (مثل ESP-CAL)، المقاس، أو بلد المنشأ..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="custom-input border-start-0"
                />
              </InputGroup>
            </Col>

            {/* Finish Filter */}
            <Col sm={6} md={3}>
              <Form.Select 
                value={selectedFinish}
                onChange={(e) => setSelectedFinish(e.target.value)}
                className="custom-input"
              >
                <option value="الكل">جميع أنواع اللمعة والتشطيب</option>
                <option value="لامع">لامع / كريستال عاكس</option>
                <option value="مط">مط / مطب</option>
                <option value="ملمس">ملمس خشب / حجر بارز</option>
              </Form.Select>
            </Col>

            {/* Sort Dropdown */}
            <Col sm={6} md={4}>
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

              {/* In-Stock Toggle Switch */}
              <Form.Check 
                type="switch"
                id="in-stock-only-switch"
                label="المتوفر في المخازن فقط للتسليم الفوري"
                checked={inStockOnly}
                onChange={(e) => setInStockOnly(e.target.checked)}
                className="fw-bold text-dark custom-switch flex-shrink-0"
              />
            </div>

            {/* Right side: Reset Filters Button (Appears dynamically if any filter is set) */}
            {(selectedCategory !== 'الكل' || selectedSubcategory !== 'الكل' || selectedFinish !== 'الكل' || searchTerm !== '' || inStockOnly) && (
              <Button 
                variant="outline-danger" 
                size="sm" 
                className="d-flex align-items-center gap-1 fw-bold px-3 py-1.5 rounded-pill"
                onClick={() => {
                  setSelectedCategory('الكل');
                  setSelectedSubcategory('الكل');
                  setSelectedFinish('الكل');
                  setSearchTerm('');
                  setInStockOnly(false);
                  if (setCategoryFilter) setCategoryFilter('الكل');
                }}
              >
                <span>🔄</span>
                <span>إعادة ضبط الفلاتر</span>
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
            <h3 className="fw-bold text-dark mb-1">كتالوج أصناف السيراميك والبورسلين بالمعرض</h3>
            <p className="text-muted small mb-0">
              معروض حالياً ({filteredProducts.length}) صنف مع الأسعار المحدثة وحاسبة الكراتين
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
                  setSearchTerm('');
                  setInStockOnly(false);
                  if (setCategoryFilter) setCategoryFilter('الكل');
                }}
              >
                🔄 إعادة تعيين كافة الفلاتر والبحث
              </Button>
            </div>
          </div>
        ) : (
          <Row className="g-4">
            {filteredProducts.map((product) => (
              <Col key={product.id} sm={6} lg={4} xl={3}>
                <ProductCard 
                  product={product} 
                  onSelectProduct={(p) => setSelectedProduct(p)}
                  onOpenCalculator={(p) => setCalculatorProduct(p)}
                  settings={settings}
                />
              </Col>
            ))}
          </Row>
        )}
      </Container>

      {/* Product Detail Modal */}
      <ProductModal 
        product={selectedProduct}
        show={!!selectedProduct}
        onHide={() => setSelectedProduct(null)}
        settings={settings}
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
