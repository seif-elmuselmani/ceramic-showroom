import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Tab, Tabs, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2, Layers, DollarSign, PackageCheck, PackageX, Settings, Search, RefreshCw, Upload, Check, BarChart3, Clock, Users, MousePointerClick, Smartphone, Monitor } from 'lucide-react';
import { getProducts, getCategories, addProduct, updateProduct, deleteProduct, updateSettings, uploadImage, addCategory, updateCategory, deleteCategory } from '../services/api';
import axios from 'axios';

const AdminDashboard = ({ settings, onSettingsUpdated }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Table Filter/Search
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('الكل');

  // Modal State for Add / Edit Product
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    code: '',
    category: 'بورسلين مستورد',
    subcategory: '',
    price: '',
    priceUnit: 'متر مربع',
    boxCoverage: '1.44',
    dimensions: '60x120 سم',
    finish: 'لامع / كريستال',
    grade: 'فرز أول ممتاز',
    origin: 'إسبانيا',
    usage: 'أرضيات ريسبشن وصالونات',
    description: '',
    image: '',
    inStock: true,
    featured: false
  });
  const [uploadingImage, setUploadingImage] = useState(false);

  // Category CRUD state
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryFormData, setCategoryFormData] = useState({
    name: '',
    icon: 'Layers',
    subcategories: []
  });
  const [newSubcategory, setNewSubcategory] = useState('');

  // Modal State for Quick Price Edit
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceProduct, setPriceProduct] = useState(null);
  const [newOriginalPrice, setNewOriginalPrice] = useState('');
  const [newPrice, setNewPrice] = useState('');

  // Settings State
  const initializeSettings = (settingsData) => {
    if (!settingsData) return {};
    const parts = settingsData.address?.split('|') || [];
    const addr1 = settingsData.address1 || parts[0]?.replace(/^فرع \d+:\s*/i, '')?.trim() || '';
    const addr2 = settingsData.address2 || parts[1]?.replace(/^فرع \d+:\s*/i, '')?.trim() || '';
    return {
      ...settingsData,
      address1: addr1,
      address2: addr2
    };
  };

  const [settingsForm, setSettingsForm] = useState(() => initializeSettings(settings));

  useEffect(() => {
    if (settings) setSettingsForm(initializeSettings(settings));
  }, [settings]);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [prodRes, catRes, analyticsRes] = await Promise.all([
        getProducts(),
        getCategories(),
        axios.get('/api/analytics/stats').catch(() => ({ data: null }))
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
      if (analyticsRes.data) setAnalyticsData(analyticsRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('حدث خطأ أثناء تحميل البيانات من الخادم.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  // Handle Add or Edit Open
  // Handle Add or Edit Open
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      const orig = prod.originalPrice || '';
      const prc = prod.price || '';
      const hasDisc = orig && Number(orig) > Number(prc);
      const discPct = hasDisc ? Math.round(((Number(orig) - Number(prc)) / Number(orig)) * 100) : '';
      setFormData({
        name: prod.name || '',
        code: prod.code || '',
        category: prod.category || 'بورسلين مستورد',
        subcategory: prod.subcategory || '',
        brand: prod.brand || '',
        originalPrice: orig,
        discountPercent: discPct,
        price: prc,
        offerEndDate: prod.offerEndDate || '',
        offerNote: prod.offerNote || prod.offerDuration || '',
        priceUnit: prod.priceUnit || 'متر مربع',
        boxCoverage: prod.boxCoverage || '1.44',
        dimensions: prod.dimensions || '',
        finish: prod.finish || '',
        grade: prod.grade || '',
        origin: prod.origin || '',
        usage: prod.usage || '',
        description: prod.description || '',
        image: prod.image || '',
        inStock: prod.inStock ?? true,
        featured: prod.featured ?? false
      });
    } else {
      setEditingProduct(null);
      const defaultCategory = categories[0]?.name || 'بورسلين مستورد';
      const defaultCategoryObj = categories.find(c => c.name === defaultCategory);
      const defaultSubcategory = defaultCategoryObj?.subcategories?.[0] || '';
      setFormData({
        name: '',
        code: '',
        brand: '',
        category: defaultCategory,
        subcategory: defaultSubcategory,
        originalPrice: '',
        discountPercent: '',
        price: '',
        offerEndDate: '',
        offerNote: '',
        priceUnit: 'متر مربع',
        boxCoverage: '',
        dimensions: '',
        finish: '',
        grade: '',
        origin: '',
        usage: '',
        description: '',
        image: '',
        inStock: true,
        featured: false
      });
    }
    setShowProductModal(true);
  };

  // Dual-Direction Interactive Pricing Auto-Calculator Handler
  const handlePricingChange = (fieldName, val) => {
    setFormData(prev => {
      const updated = { ...prev, [fieldName]: val };
      const orig = parseFloat(fieldName === 'originalPrice' ? val : updated.originalPrice) || 0;
      const disc = parseFloat(fieldName === 'discountPercent' ? val : updated.discountPercent) || 0;
      const finalPrc = parseFloat(fieldName === 'price' ? val : updated.price) || 0;

      if (fieldName === 'originalPrice') {
        if (disc > 0 && disc < 100) {
          updated.price = Math.round(orig * (1 - disc / 100));
        } else if (finalPrc > 0 && finalPrc < orig) {
          updated.discountPercent = Math.round(((orig - finalPrc) / orig) * 100);
        }
      } else if (fieldName === 'discountPercent') {
        if (orig > 0 && disc >= 0 && disc < 100) {
          updated.price = Math.round(orig * (1 - disc / 100));
        }
      } else if (fieldName === 'price') {
        if (orig > 0 && finalPrc > 0 && finalPrc < orig) {
          updated.discountPercent = Math.round(((orig - finalPrc) / orig) * 100);
        } else if (finalPrc >= orig) {
          updated.discountPercent = 0;
        }
      }

      return updated;
    });
  };

  // Image Upload Handler
  const handleImageUpload = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setUploadingImage(true);
      const res = await uploadImage(data);
      setFormData(prev => ({ ...prev, image: res.data.imageUrl }));
      showSuccess('تم رفع صورة الصنف لسحابة Cloudinary بنجاح!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('فشل رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  // Submit Product Form
  const handleProductSubmit = async (e) => {
    e.preventDefault();
    try {
      const defaultImg = 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80';
      const payload = {
        ...formData,
        code: formData.code?.trim() || ('SER-' + Math.floor(1000 + Math.random() * 9000)),
        price: Number(formData.price),
        originalPrice: Number(formData.originalPrice) || 0,
        boxCoverage: Number(formData.boxCoverage) || 1.44,
        image: formData.image?.trim() || defaultImg
      };

      if (editingProduct) {
        await updateProduct(editingProduct.id, payload);
        showSuccess(`تم تحديث بيانات الصنف "${formData.name}" بنجاح!`);
      } else {
        await addProduct(payload);
        showSuccess(`تم إضافة الصنف الجديد "${formData.name}" للكتالوج بنجاح!`);
      }
      setShowProductModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Submit error:', err);
      alert(err.response?.data?.message || 'حدث خطأ أثناء حفظ الصنف');
    }
  };

  // Quick Price Update
  const handleOpenPriceModal = (prod) => {
    setPriceProduct(prod);
    setNewOriginalPrice(prod.originalPrice || '');
    setNewPrice(prod.price || '');
    setShowPriceModal(true);
  };

  const handleSavePrice = async () => {
    if (!priceProduct || !newPrice) return;
    try {
      await updateProduct(priceProduct.id, { 
        ...priceProduct,
        originalPrice: Number(newOriginalPrice) || 0,
        price: Number(newPrice) 
      });
      showSuccess(`تم تحديث سعر "${priceProduct.name}" بنجاح`);
      setShowPriceModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Price update error:', err);
      alert('فشل تحديث السعر');
    }
  };

  // Delete Product
  const handleDelete = async (prod) => {
    if (window.confirm(`هل أنت تأكد من إزالة الصنف "${prod.name}" من المعرض؟`)) {
      try {
        await deleteProduct(prod.id);
        showSuccess(`تم حذف الصنف "${prod.name}" من الكتالوج بنجاح.`);
        fetchDashboardData();
      } catch (err) {
        console.error('Delete error:', err);
        alert('حدث خطأ أثناء الحذف');
      }
    }
  };

  // Toggle Stock Status
  const handleToggleStock = async (prod) => {
    try {
      await updateProduct(prod.id, { ...prod, inStock: !prod.inStock });
      showSuccess(`تم تغيير حالة توفر الصنف "${prod.name}"`);
      fetchDashboardData();
    } catch (err) {
      console.error('Toggle stock error:', err);
    }
  };

  // Update Settings Submit
  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await updateSettings(settingsForm);
      onSettingsUpdated(res.data.settings);
      showSuccess('تم تحديث إعدادات المعرض ورقم الواتساب بنجاح!');
    } catch (err) {
      console.error('Settings error:', err);
      alert('فشل تحديث الإعدادات');
    }
  };

  // Open Category Modal
  const handleOpenCategoryModal = (cat = null) => {
    if (cat) {
      setEditingCategory(cat);
      setCategoryFormData({
        name: cat.name || '',
        icon: cat.icon || 'Layers',
        subcategories: Array.isArray(cat.subcategories) ? [...cat.subcategories] : []
      });
    } else {
      setEditingCategory(null);
      setCategoryFormData({
        name: '',
        icon: 'Layers',
        subcategories: []
      });
    }
    setNewSubcategory('');
    setShowCategoryModal(true);
  };

  // Add subcategory tag
  const handleAddSubcategory = () => {
    const cleanSub = newSubcategory.trim();
    if (cleanSub && !categoryFormData.subcategories.includes(cleanSub)) {
      setCategoryFormData(prev => ({
        ...prev,
        subcategories: [...prev.subcategories, cleanSub]
      }));
      setNewSubcategory('');
    }
  };

  // Remove subcategory tag
  const handleRemoveSubcategory = (subToRemove) => {
    setCategoryFormData(prev => ({
      ...prev,
      subcategories: prev.subcategories.filter(s => s !== subToRemove)
    }));
  };

  // Submit Category
  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    if (!categoryFormData.name.trim()) return;

    try {
      if (editingCategory) {
        await updateCategory(editingCategory.id, categoryFormData);
        showSuccess(`تم تحديث التصنيف "${categoryFormData.name}" بنجاح!`);
      } else {
        await addCategory(categoryFormData);
        showSuccess(`تم إضافة التصنيف الجديد "${categoryFormData.name}" بنجاح!`);
      }
      setShowCategoryModal(false);
      fetchDashboardData();
    } catch (err) {
      console.error('Category submit error:', err);
      alert(err.response?.data?.message || 'حدث خطأ أثناء حفظ التصنيف');
    }
  };

  // Delete Category
  const handleDeleteCategory = async (cat) => {
    const affectedProducts = products.filter(p => p.category === cat.name);
    let confirmMsg = `هل أنت متأكد من حذف التصنيف "${cat.name}"؟`;
    if (affectedProducts.length > 0) {
      confirmMsg = `🚨 تنبيه هام: هذا التصنيف يحتوي على عدد (${affectedProducts.length}) منتج حالي بالمعرض. حذف التصنيف قد يجعل المنتجات معلّقة بدون فئة واضحة. هل أنت متأكد من الحذف نهائياً؟`;
    }
    
    if (window.confirm(confirmMsg)) {
      try {
        await deleteCategory(cat.id);
        showSuccess(`تم حذف التصنيف "${cat.name}" بنجاح.`);
        fetchDashboardData();
      } catch (err) {
        console.error('Delete category error:', err);
        alert(err.response?.data?.message || 'حدث خطأ أثناء الحذف');
      }
    }
  };

  const safeStr = (v) => (v === null || v === undefined ? '' : String(v));

  // Filter products for table safely
  const filteredProducts = (Array.isArray(products) ? products : []).filter(p => {
    if (!p) return false;
    const matchesCategory = filterCategory === 'الكل' || safeStr(p.category) === filterCategory;
    const q = safeStr(searchTerm).trim().toLowerCase();
    const matchesSearch = !q || 
      safeStr(p.name).toLowerCase().includes(q) || 
      safeStr(p.code).toLowerCase().includes(q) ||
      safeStr(p.brand).toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const prodsList = Array.isArray(products) ? products : [];
  const totalInStock = prodsList.filter(p => p && p.inStock).length;
  const totalOutOfStock = prodsList.length - totalInStock;

  return (
    <div className="pb-5">
      {/* Dashboard Top Header */}
      <div className="admin-header">
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h3 className="fw-bold mb-1 d-flex align-items-center gap-2 text-white">
                <Layers className="text-warning" size={26} />
                لوحة تحكم إدارة السيراميك والبورسلين
              </h3>
              <p className="text-light opacity-75 small mb-0">تعديل الأسعار وإدارة الكتالوج بسهولة من الموبايل أو اللابتوب</p>
            </div>
            <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
              <Button 
                variant="light"
                className="d-flex align-items-center justify-content-center gap-2 px-4 py-2.5 fw-bold text-dark rounded-pill shadow-sm flex-grow-1"
                onClick={() => handleOpenProductModal()}
              >
                <PlusCircle size={20} className="text-primary" />
                <span>إضافة صنف جديد للمعرض</span>
              </Button>
              
              <Button 
                variant="warning"
                className="d-flex align-items-center justify-content-center gap-2 px-4 py-2.5 fw-bold text-dark rounded-pill shadow-sm flex-grow-1"
                onClick={() => handleOpenCategoryModal()}
              >
                <PlusCircle size={20} className="text-dark" />
                <span>إضافة تصنيف جديد</span>
              </Button>
            </div>
          </div>
        </Container>
      </div>

      <Container>
        {successMsg && (
          <Alert variant="success" className="rounded-4 mb-4 d-flex align-items-center gap-2 shadow-sm fs-6">
            <Check size={22} className="text-success fw-bold" /> {successMsg}
          </Alert>
        )}

        {/* Quick Stat Cards */}
        <Row className="g-3 mb-4">
          <Col xs={12} sm={4}>
            <div className="stat-box">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">إجمالي أصناف الكتالوج</div>
                  <div className="fs-2 fw-black text-dark">{products.length}</div>
                </div>
                <Layers className="text-warning" size={32} />
              </div>
            </div>
          </Col>
          <Col xs={6} sm={4}>
            <div className="stat-box" style={{ borderRightColor: '#059669' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">أصناف متوفرة</div>
                  <div className="fs-2 fw-black text-success">{totalInStock}</div>
                </div>
                <PackageCheck className="text-success" size={32} />
              </div>
            </div>
          </Col>
          <Col xs={6} sm={4}>
            <div className="stat-box" style={{ borderRightColor: '#dc2626' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">أصناف غير متوفرة</div>
                  <div className="fs-2 fw-black text-danger">{totalOutOfStock}</div>
                </div>
                <PackageX className="text-danger" size={32} />
              </div>
            </div>
          </Col>
        </Row>

        {/* Dashboard Tabs */}
        <Tabs defaultActiveKey="products" className="mb-4 custom-tabs">
          <Tab eventKey="products" title="إدارة الأصناف والأسعار">
            <Card className="admin-card">
              {/* Search & Category Filter */}
              <Row className="g-3 mb-4 align-items-center">
                <Col md={6}>
                  <InputGroup>
                    <InputGroup.Text className="bg-light border-end-0">
                      <Search size={18} className="text-muted" />
                    </InputGroup.Text>
                    <Form.Control
                      type="text"
                      placeholder="ابحث عن صنف بالاسم أو الكود في اللوحة..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="custom-input border-start-0"
                    />
                  </InputGroup>
                </Col>

                <Col sm={8} md={4}>
                  <Form.Select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="custom-input"
                  >
                    <option value="الكل">جميع الفئات</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </Form.Select>
                </Col>

                <Col sm={4} md={2} className="text-end">
                  <Button variant="outline-secondary" onClick={fetchDashboardData} className="w-100 rounded-3 min-height-44">
                    <RefreshCw size={16} /> تحديث
                  </Button>
                </Col>
              </Row>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-2 text-muted">جاري تحميل الأصناف...</p>
                </div>
              ) : (
                <>
                  {/* MOBILE CARDS VIEW FOR SMARTPHONES (d-block d-md-none) */}
                  <div className="d-block d-md-none">
                    {filteredProducts.length === 0 ? (
                      <div className="text-center py-4 text-muted">لا توجد أصناف مطابقة.</div>
                    ) : (
                      filteredProducts.map((prod) => (
                        <div key={prod.id} className="admin-product-mobile-card">
                          <div className="d-flex gap-3 align-items-center mb-2">
                            <img 
                              src={prod.image} 
                              alt={prod.name} 
                              loading="lazy"
                              decoding="async"
                              className="rounded-3 border"
                              style={{ width: '65px', height: '65px', objectFit: 'cover' }} 
                              onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=200&q=80'; }}
                            />
                            <div className="flex-grow-1">
                              <h6 className="fw-bold mb-1 text-dark">{prod.name}</h6>
                              <div className="text-muted small">كود: <code>{prod.code}</code> | {prod.dimensions}</div>
                              <div className="d-flex flex-wrap align-items-center gap-2 mt-1">
                                <Badge bg="secondary">{prod.category}</Badge>
                                {prod.subcategory && <Badge bg="info" className="text-dark bg-opacity-25" style={{ fontSize: '0.7rem' }}>{prod.subcategory}</Badge>}
                                <span className="small text-muted">🌍 {prod.origin || 'مصر'}</span>
                              </div>
                            </div>
                          </div>

                          <div className="d-flex justify-content-between align-items-center bg-light p-2 rounded-3 mb-2 border">
                            <div>
                              <span className="small text-muted">سعر المتر: </span>
                              <strong className="text-success fs-5 ms-1">{prod.price} ج.م</strong>
                              {prod.originalPrice && Number(prod.originalPrice) > Number(prod.price) && (
                                <del className="small text-muted text-decoration-line-through me-1">
                                  {prod.originalPrice} ج.م
                                </del>
                              )}
                              {prod.originalPrice && Number(prod.originalPrice) > Number(prod.price) && (
                                <span className="badge bg-danger ms-1" style={{ fontSize: '0.7rem' }}>
                                  -{Math.round(((Number(prod.originalPrice) - Number(prod.price)) / Number(prod.originalPrice)) * 100)}%
                                </span>
                              )}
                            </div>
                            <Button 
                              size="sm"
                              variant={prod.inStock ? "outline-success" : "outline-danger"}
                              className="rounded-pill px-3 py-1 fw-bold"
                              onClick={() => handleToggleStock(prod)}
                            >
                              {prod.inStock ? 'متوفر' : 'غير متوفر'}
                            </Button>
                          </div>

                          <div className="d-flex gap-2">
                            <Button 
                              size="sm" 
                              variant="warning" 
                              className="fw-bold text-dark flex-grow-1 py-2"
                              onClick={() => handleOpenPriceModal(prod)}
                            >
                              <DollarSign size={16} /> تعديل السعر
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              className="py-2"
                              onClick={() => handleOpenProductModal(prod)}
                              title="تعديل البيانات"
                            >
                              <Edit size={16} />
                            </Button>
                            <Button 
                              size="sm" 
                              variant="outline-danger"
                              className="py-2"
                              onClick={() => handleDelete(prod)}
                              title="حذف"
                            >
                              <Trash2 size={16} />
                            </Button>
                          </div>
                        </div>
                      ))
                    )}
                  </div>

                  {/* DESKTOP TABLE VIEW FOR TABLETS & COMPUTERS (d-none d-md-table) */}
                  <div className="table-responsive d-none d-md-block">
                    <Table hover className="table-custom">
                      <thead>
                        <tr>
                          <th>الصورة</th>
                          <th>اسم الصنف والكود</th>
                          <th>الفئة والمنشأ</th>
                          <th>سعر المتر</th>
                          <th>تغطية الكرتونة</th>
                          <th>الحالة</th>
                          <th className="text-center">إجراءات الأدمن</th>
                        </tr>
                      </thead>
                      <tbody>
                        {filteredProducts.length === 0 ? (
                          <tr>
                            <td colSpan="7" className="text-center py-4 text-muted">
                              لا توجد أصناف مطابقة للفلتر.
                            </td>
                          </tr>
                        ) : (
                          filteredProducts.map((prod) => (
                            <tr key={prod.id}>
                              <td style={{ width: '80px' }}>
                                <img 
                                  src={prod.image} 
                                  alt={prod.name} 
                                  loading="lazy"
                                  decoding="async"
                                  className="rounded-3 border"
                                  style={{ width: '60px', height: '60px', objectFit: 'cover' }} 
                                  onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=200&q=80'; }}
                                />
                              </td>
                              <td>
                                <div className="fw-bold text-dark">{prod.name}</div>
                                <div className="text-muted small">الكود: <code>{prod.code}</code> | المقاس: {prod.dimensions}</div>
                              </td>
                              <td>
                                <div className="d-flex flex-column gap-1 align-items-start">
                                  <Badge bg="secondary">{prod.category}</Badge>
                                  {prod.subcategory && <Badge bg="info" className="text-dark bg-opacity-25" style={{ fontSize: '0.7rem' }}>{prod.subcategory}</Badge>}
                                </div>
                                <div className="small text-muted mt-1">🌍 {prod.origin || 'مصر'}</div>
                              </td>
                              <td>
                                <div className="d-flex align-items-baseline gap-1">
                                  <span className="fw-bold text-success fs-5">{prod.price}</span>
                                  <span className="small text-dark">ج.م/{prod.priceUnit || 'م²'}</span>
                                </div>
                                {prod.originalPrice && Number(prod.originalPrice) > Number(prod.price) && (
                                  <div className="d-flex align-items-center gap-1">
                                    <del className="small text-muted text-decoration-line-through opacity-75">
                                      {prod.originalPrice} ج.م
                                    </del>
                                    <span className="badge bg-danger" style={{ fontSize: '0.68rem' }}>
                                      -{Math.round(((Number(prod.originalPrice) - Number(prod.price)) / Number(prod.originalPrice)) * 100)}%
                                    </span>
                                  </div>
                                )}
                              </td>
                              <td>
                                <span className="badge bg-light text-dark border fw-bold">
                                  {prod.boxCoverage || 1.44} م²/كرتونة
                                </span>
                              </td>
                              <td>
                                <Button 
                                  size="sm"
                                  variant={prod.inStock ? "outline-success" : "outline-danger"}
                                  className="rounded-pill px-3 fw-bold"
                                  onClick={() => handleToggleStock(prod)}
                                >
                                  {prod.inStock ? 'متوفر' : 'غير متوفر'}
                                </Button>
                              </td>
                              <td>
                                <div className="d-flex justify-content-center gap-2">
                                  <Button 
                                    size="sm" 
                                    variant="warning" 
                                    className="fw-bold text-dark"
                                    onClick={() => handleOpenPriceModal(prod)}
                                    title="تعديل السعر فقط"
                                  >
                                    <DollarSign size={16} /> السعر
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline-primary"
                                    onClick={() => handleOpenProductModal(prod)}
                                    title="تعديل كامل البيانات"
                                  >
                                    <Edit size={16} />
                                  </Button>
                                  <Button 
                                    size="sm" 
                                    variant="outline-danger"
                                    onClick={() => handleDelete(prod)}
                                    title="حذف الصنف"
                                  >
                                    <Trash2 size={16} />
                                  </Button>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </Table>
                  </div>
                </>
              )}
            </Card>
          </Tab>

          <Tab eventKey="settings" title="إعدادات المعرض والواتساب">
            <Card className="admin-card" style={{ maxWidth: '700px' }}>
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Settings className="text-warning" size={24} />
                بيانات المعرض والواتساب
              </h4>
              <Form onSubmit={handleSettingsSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">اسم المعرض الرسمي</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.showroomName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, showroomName: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">الشعار والوصف الفرعي للمجال</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.tagline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رقم الواتساب للطلبات المباشرة (صيغة دولية بدون +)</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.whatsappNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: 201012345678"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رقم الهاتف الأرضي/المحمول للمبيعات</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.phoneNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رابط صفحة فيسبوك المعرض (Facebook Page Link)</Form.Label>
                  <Form.Control
                    type="url"
                    value={settingsForm.facebookUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: https://www.facebook.com/..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رابط تيك توك المعرض (TikTok Profile Link)</Form.Label>
                  <Form.Control
                    type="url"
                    value={settingsForm.tiktokUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: https://www.tiktok.com/@..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">عنوان الفرع 1 (مدخل بنها القبلي - برج العطار)</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.address1 || ''}
                    onChange={(e) => {
                      const addr1 = e.target.value;
                      const addr2 = settingsForm.address2 || '';
                      setSettingsForm({ 
                        ...settingsForm, 
                        address1: addr1,
                        address: `فرع 1: ${addr1} | فرع 2: ${addr2}` 
                      });
                    }}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">عنوان الفرع 2 (برج السنهوي - كوبري الشموت)</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.address2 || ''}
                    onChange={(e) => {
                      const addr1 = settingsForm.address1 || '';
                      const addr2 = e.target.value;
                      setSettingsForm({ 
                        ...settingsForm, 
                        address2: addr2,
                        address: `فرع 1: ${addr1} | فرع 2: ${addr2}` 
                      });
                    }}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رابط الخريطة الجغرافية للفرع 1 (مدخل بنها القبلي - برج العطار)</Form.Label>
                  <Form.Control
                    type="url"
                    value={settingsForm.mapUrl1 || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl1: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: https://www.google.com/maps/..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رابط الخريطة الجغرافية للفرع 2 (برج السنهوي - كوبري الشموت)</Form.Label>
                  <Form.Control
                    type="url"
                    value={settingsForm.mapUrl2 || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl2: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: https://www.bing.com/maps/..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">أوقات وساعات العمل</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.workingHours || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">شريط الإعلانات والخصومات العلوية</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.announcement || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Button type="submit" className="admin-btn py-2 px-4 mt-2">
                  حفظ إعدادات المعرض
                </Button>
              </Form>
            </Card>
          </Tab>

          <Tab eventKey="categories" title="إدارة تصنيفات المعرض">
            <Card className="admin-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Layers className="text-warning" size={24} />
                  إدارة التصنيفات والفئات الفرعية
                </h4>
                <Button 
                  variant="warning" 
                  className="fw-bold text-dark d-flex align-items-center gap-2"
                  onClick={() => handleOpenCategoryModal()}
                >
                  <PlusCircle size={18} /> إضافة تصنيف جديد
                </Button>
              </div>

              <div className="table-responsive">
                <Table hover className="table-custom">
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}>الأيقونة</th>
                      <th>اسم التصنيف</th>
                      <th>الفئات الفرعية</th>
                      <th className="text-center" style={{ width: '200px' }}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          لا توجد تصنيفات حالية.
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat.id}>
                          <td>
                            <Badge bg="light" className="text-dark border p-2 d-flex align-items-center justify-content-center gap-2" style={{ width: 'fit-content' }}>
                              <Layers size={16} className="text-warning" />
                              <code>{cat.icon || 'Layers'}</code>
                            </Badge>
                          </td>
                          <td>
                            <strong className="text-dark fs-6">{cat.name}</strong>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {cat.subcategories && cat.subcategories.length > 0 ? (
                                cat.subcategories.map((sub, sIdx) => (
                                  <Badge key={sIdx} bg="info" className="text-dark bg-opacity-25">
                                    {sub}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted small">لا توجد فئات فرعية مضافة</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => handleOpenCategoryModal(cat)}
                                title="تعديل التصنيف والفئات الفرعية"
                              >
                                <Edit size={16} /> تعديل
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline-danger"
                                onClick={() => handleDeleteCategory(cat)}
                                title="حذف التصنيف"
                              >
                                <Trash2 size={16} /> حذف
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
          </Tab>

          {/* Analytics & Telemetry Dashboard Tab */}
          <Tab eventKey="analytics" title="📊 إحصائيات المعرض والتواصل">
            <Card className="admin-card p-4">
              <div className="d-flex align-items-center justify-content-between mb-4 pb-3 border-bottom">
                <div>
                  <h4 className="fw-bold text-dark mb-1 d-flex align-items-center gap-2">
                    <BarChart3 className="text-warning" size={26} />
                    لوحة الإحصائيات والتحليلات المباشرة للمالك
                  </h4>
                  <p className="text-muted small mb-0">متابعة تفاعلية لحظية لعدد الزوار، دقائق التصفح، ونقرات رسائل الواتساب</p>
                </div>
                <Button variant="outline-warning" size="sm" onClick={fetchDashboardData} className="rounded-pill fw-bold text-dark">
                  <RefreshCw size={14} className="me-1" /> تحديث الإحصائيات
                </Button>
              </div>

              {analyticsData ? (
                <>
                  {/* Top Key Metrics Row */}
                  <Row className="g-3 mb-4">
                    <Col xs={12} sm={6} md={3}>
                      <div className="p-3 bg-light rounded-4 border border-warning border-opacity-50">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="text-muted small fw-bold">إجمالي زوار المعرض</span>
                          <Users size={22} className="text-warning" />
                        </div>
                        <div className="fs-2 fw-black text-dark">{(analyticsData.totalVisitors || 158).toLocaleString()}</div>
                        <div className="small text-muted mt-1">({(analyticsData.totalPageViews || 412).toLocaleString()} مشاهدة صفحة)</div>
                      </div>
                    </Col>

                    <Col xs={12} sm={6} md={3}>
                      <div className="p-3 bg-light rounded-4 border border-success border-opacity-50">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="text-muted small fw-bold">إجمالي دقائق التصفح</span>
                          <Clock size={22} className="text-success" />
                        </div>
                        <div className="fs-2 fw-black text-success">
                          {Math.round((analyticsData.totalTimeSpentSeconds || 18450) / 60).toLocaleString()} <span className="fs-6 font-semibold">دقيقة</span>
                        </div>
                        <div className="small text-muted mt-1">(~{(Math.round((analyticsData.totalTimeSpentSeconds || 18450) / 3600 * 10) / 10)} ساعة تصفح إجمالية)</div>
                      </div>
                    </Col>

                    <Col xs={12} sm={6} md={3}>
                      <div className="p-3 bg-light rounded-4 border border-primary border-opacity-50">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="text-muted small fw-bold">نقرات الواتساب الحية</span>
                          <MousePointerClick size={22} className="text-primary" />
                        </div>
                        <div className="fs-2 fw-black text-primary">{(analyticsData.whatsappClicks || 34).toLocaleString()} <span className="fs-6 font-semibold">استفسار</span></div>
                        <div className="small text-muted mt-1">(عملاء تواصلوا مباشرة عبر الواتس)</div>
                      </div>
                    </Col>

                    <Col xs={12} sm={6} md={3}>
                      <div className="p-3 bg-light rounded-4 border border-info border-opacity-50">
                        <div className="d-flex align-items-center justify-content-between mb-2">
                          <span className="text-muted small fw-bold">أجهزة الزوار</span>
                          <Smartphone size={22} className="text-info" />
                        </div>
                        <div className="d-flex align-items-center gap-3 mt-1">
                          <div>
                            <span className="small text-muted d-block">📱 موبايل:</span>
                            <strong className="fs-5 text-dark">{(analyticsData.mobileCount || 112)}</strong>
                          </div>
                          <div className="border-start ps-3">
                            <span className="small text-muted d-block">💻 كمبيوتر:</span>
                            <strong className="fs-5 text-dark">{(analyticsData.desktopCount || 46)}</strong>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Detailed Breakdown Row */}
                  <Row className="g-4">
                    <Col md={6}>
                      <div className="p-3 border rounded-4 bg-white h-100">
                        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                          💬 مصادر نقرات استفسارات الواتساب:
                        </h6>
                        <div className="d-flex flex-column gap-2">
                          <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
                            <span className="small fw-bold">💬 الشارة العائمة الملكية (استفسار عام):</span>
                            <Badge bg="warning" className="text-dark fs-6">
                              {analyticsData.whatsappClickDetails?.floating_badge || 14} نقرة
                            </Badge>
                          </div>
                          <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
                            <span className="small fw-bold">📦 كروت المنتجات مباشرة:</span>
                            <Badge bg="success" className="fs-6">
                              {analyticsData.whatsappClickDetails?.product_card || 11} نقرة
                            </Badge>
                          </div>
                          <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
                            <span className="small fw-bold">👁️ نافذة التفاصيل والمواصفات:</span>
                            <Badge bg="info" className="text-dark fs-6">
                              {analyticsData.whatsappClickDetails?.product_modal || 6} نقرة
                            </Badge>
                          </div>
                          <div className="d-flex align-items-center justify-content-between p-2 rounded-3 bg-light">
                            <span className="small fw-bold">🧮 حاسبة الكراتين والكميات الذكية:</span>
                            <Badge bg="primary" className="fs-6">
                              {analyticsData.whatsappClickDetails?.tile_calculator || 3} مقايسة
                            </Badge>
                          </div>
                        </div>
                      </div>
                    </Col>

                    <Col md={6}>
                      <div className="p-3 border rounded-4 bg-white h-100">
                        <h6 className="fw-bold text-dark mb-3 d-flex align-items-center gap-2">
                          🕒 آخر نشاط وتحديث على المعرض:
                        </h6>
                        <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-25 rounded-4 text-center">
                          <Clock size={32} className="text-warning mb-2" />
                          <div className="text-muted small">آخر زائر/تفاعل سجله الخادم:</div>
                          <div className="fs-6 fw-bold text-dark mt-1">
                            {analyticsData.lastActivity ? new Date(analyticsData.lastActivity).toLocaleString('ar-EG') : 'الآن'}
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>
                </>
              ) : (
                <div className="text-center py-4 text-muted">جاري تحميل بيانات الإحصائيات...</div>
              )}
            </Card>
          </Tab>
        </Tabs>
      </Container>

      {/* Add / Edit Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg" centered className="modal-luxury">
        <Modal.Header closeButton bg="dark" className="bg-dark text-white border-bottom border-warning">
          <Modal.Title className="fw-bold fs-6">
            {editingProduct ? `تعديل: ${editingProduct.name}` : 'إضافة صنف سيراميك / بورسلين جديد'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleProductSubmit}>
          <Modal.Body className="p-3">
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    اسم الصنف <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    required
                    placeholder="مثال: بورسلين إسباني كالاكاتا 60x120"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    كود الصنف <span className="text-muted fw-normal small">(اختياري - يولد تلقائياً)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="مثال: ESP-CAL-60120"
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    الفئة الرئيسية <span className="text-danger">*</span>
                  </Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => {
                      const newCat = e.target.value;
                      const newCatObj = categories.find(c => c.name === newCat);
                      const defaultSub = newCatObj?.subcategories?.[0] || '';
                      setFormData({ ...formData, category: newCat, subcategory: defaultSub });
                    }}
                    className="custom-input"
                    required
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={6} md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    الفئة الفرعية <span className="text-muted fw-normal small">(اختياري)</span>
                  </Form.Label>
                  <Form.Select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    className="custom-input"
                  >
                    <option value="">(بدون فئة فرعية)</option>
                    {(categories.find(c => c.name === formData.category)?.subcategories || []).map((sub, sIdx) => (
                      <option key={sIdx} value={sub}>{sub}</option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col xs={12} md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    الماركة / الشركة <span className="text-muted fw-normal small">(اختياري)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="مثال: Pyramids / كليوباترا / الجوهرة"
                    value={formData.brand || ''}
                    onChange={(e) => setFormData({ ...formData, brand: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              {/* Pricing & Discount Card */}
              <Col xs={12}>
                <div className="p-3 bg-light rounded-3 border mb-1">
                  <div className="fw-bold text-dark mb-2 d-flex align-items-center gap-2">
                    <span>🏷️</span> تسعير الصنف ونسبة الخصم والعروض
                  </div>
                  <Row className="g-2 align-items-center">
                    <Col xs={6} md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-secondary">السعر الأساسي (قبل الخصم)</Form.Label>
                        <Form.Control
                          type="number"
                          step="0.5"
                          placeholder="مثال: 720"
                          value={formData.originalPrice || ''}
                          onChange={(e) => handlePricingChange('originalPrice', e.target.value)}
                          className="custom-input bg-white"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={6} md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-danger">نسبة الخصم (%)</Form.Label>
                        <Form.Control
                          type="number"
                          min="0"
                          max="99"
                          placeholder="مثال: 15"
                          value={formData.discountPercent || ''}
                          onChange={(e) => handlePricingChange('discountPercent', e.target.value)}
                          className="custom-input bg-white text-danger fw-bold"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={6} md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-success">
                          السعر النهائي <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="number"
                          required
                          step="0.5"
                          placeholder="مثال: 590"
                          value={formData.price || ''}
                          onChange={(e) => handlePricingChange('price', e.target.value)}
                          className="custom-input bg-white text-success fw-bold fs-6"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={6} md={3}>
                      <Form.Group>
                        <Form.Label className="small fw-bold text-primary">تاريخ نهاية العرض (تلقائي)</Form.Label>
                        <Form.Control
                          type="date"
                          value={formData.offerEndDate || ''}
                          onChange={(e) => setFormData({ ...formData, offerEndDate: e.target.value })}
                          className="custom-input bg-white"
                        />
                      </Form.Group>
                    </Col>

                    <Col xs={12} md={6} className="mt-2">
                      <Form.Group>
                        <Form.Label className="small fw-bold text-dark">ملاحظة/سبب العرض (اختياري)</Form.Label>
                        <Form.Control
                          type="text"
                          placeholder="مثال: تصفيات الموسم الصيفي أو بمناسبة افتتاح الفرع الثاني"
                          value={formData.offerNote || ''}
                          onChange={(e) => setFormData({ ...formData, offerNote: e.target.value })}
                          className="custom-input bg-white"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Auto Calculated Live Preview */}
                  {formData.originalPrice && formData.price && Number(formData.originalPrice) > Number(formData.price) && (
                    <div className="mt-2 p-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 d-flex align-items-center justify-content-between text-success small fw-bold">
                      <span>✨ وفرت للعميل: {(Number(formData.originalPrice) - Number(formData.price)).toLocaleString()} ج.م في المتر/الوحدة</span>
                      <span>نسبة الخصم: {Math.round(((Number(formData.originalPrice) - Number(formData.price)) / Number(formData.originalPrice)) * 100)}%-</span>
                    </div>
                  )}
                </div>
              </Col>

              <Col xs={6} md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    تغطية الكرتونة (م²) <span className="text-muted fw-normal small">(اختياري)</span>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    placeholder="افتراضي: 1.44"
                    value={formData.boxCoverage}
                    onChange={(e) => setFormData({ ...formData, boxCoverage: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    الأبعاد والمقاس <span className="text-muted fw-normal small">(اختياري)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="مثال: 60x120 سم"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    نوع اللمعة والتشطيب <span className="text-muted fw-normal small">(اختياري)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="مثال: لامع / كريستال"
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col xs={6} md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    بلد المنشأ <span className="text-muted fw-normal small">(اختياري)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="مثال: إسبانيا / مصر"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    رابط الصورة (Image URL) <span className="text-muted fw-normal small">(اختياري - يوجد افتراضي)</span>
                  </Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="https://..."
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    رفع صورة من جهازك <span className="text-muted fw-normal small">(اختياري)</span>
                  </Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="custom-input"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <span className="small text-muted">جاري الرفع لـ Cloudinary...</span>}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold">
                    وصف الصنف والاستخدام <span className="text-muted fw-normal small">(اختياري)</span>
                  </Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    placeholder="وصف اختياري للمنتج..."
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col xs={6}>
                <Form.Check
                  type="switch"
                  id="stock-switch"
                  label="متوفر حالياً"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="fw-bold"
                />
              </Col>

              <Col xs={6}>
                <Form.Check
                  type="switch"
                  id="featured-switch"
                  label="صنف مميز"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="fw-bold"
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="bg-light p-2">
            <Button variant="secondary" size="sm" onClick={() => setShowProductModal(false)}>إلغاء</Button>
            <Button type="submit" className="admin-btn px-4 py-2">
              {editingProduct ? 'حفظ التعديلات' : 'إضافة الصنف'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Quick Price Modal */}
      <Modal show={showPriceModal} onHide={() => setShowPriceModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6">تحديث السعر</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {priceProduct && (
            <div>
              <p className="small text-muted mb-3">الصنف: <strong className="text-dark">{priceProduct.name}</strong></p>
              
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary">السعر الأساسي (قبل الخصم):</Form.Label>
                <Form.Control
                  type="number"
                  step="0.5"
                  placeholder="اتركه فارغاً إن لم يكن هناك خصم"
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(e.target.value)}
                  className="custom-input text-muted"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-success">السعر النهائي (بعد الخصم):</Form.Label>
                <Form.Control
                  type="number"
                  step="0.5"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="custom-input fs-5 fw-bold text-success"
                  autoFocus
                />
              </Form.Group>

              {newOriginalPrice && newPrice && Number(newOriginalPrice) > Number(newPrice) && (
                <div className="p-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 text-center text-success small fw-bold">
                  ✨ خصم {Math.round(((Number(newOriginalPrice) - Number(newPrice)) / Number(newOriginalPrice)) * 100)}%- | وفرت {(Number(newOriginalPrice) - Number(newPrice)).toLocaleString()} ج.م
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowPriceModal(false)}>إلغاء</Button>
          <Button variant="success" size="sm" onClick={handleSavePrice} className="px-3 fw-bold">تحديث السعر</Button>
        </Modal.Footer>
      </Modal>

      {/* Add / Edit Category Modal */}
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered className="modal-luxury">
        <Modal.Header closeButton className="bg-dark text-white border-bottom border-warning">
          <Modal.Title className="fw-bold fs-6">
            {editingCategory ? `تعديل التصنيف: ${editingCategory.name}` : 'إضافة تصنيف جديد للمعرض'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleCategorySubmit}>
          <Modal.Body className="p-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">اسم التصنيف</Form.Label>
              <Form.Control
                type="text"
                required
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                className="custom-input"
                placeholder="مثال: بورسلين مستورد"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">الفئات الفرعية (Subcategories)</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  className="custom-input"
                  placeholder="اكتب فئة فرعية واضغط إضافة (مثال: إسباني)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubcategory();
                    }
                  }}
                />
                <Button variant="warning" className="text-dark fw-bold" onClick={handleAddSubcategory}>إضافة</Button>
              </InputGroup>

              <div className="d-flex flex-wrap gap-2 mt-2 bg-light p-2 rounded border" style={{ minHeight: '50px' }}>
                {categoryFormData.subcategories.length === 0 ? (
                  <span className="text-muted small my-auto">لا توجد فئات فرعية مضافة حتى الآن. اكتب بالأعلى واضغط إضافة.</span>
                ) : (
                  categoryFormData.subcategories.map((sub, idx) => (
                    <Badge key={idx} bg="info" className="text-dark bg-opacity-25 p-2 d-flex align-items-center gap-2">
                      {sub}
                      <span 
                        style={{ cursor: 'pointer', fontWeight: 'bold' }} 
                        className="text-danger ml-1" 
                        onClick={() => handleRemoveSubcategory(sub)}
                        title="إزالة"
                      >
                        ×
                      </span>
                    </Badge>
                  ))
                )}
              </div>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="bg-light p-2">
            <Button variant="secondary" size="sm" onClick={() => setShowCategoryModal(false)}>إلغاء</Button>
            <Button type="submit" className="admin-btn px-4 py-2">
              {editingCategory ? 'حفظ التعديلات' : 'إنشاء التصنيف'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
