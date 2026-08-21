import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Tab, Tabs, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2, Layers, DollarSign, PackageCheck, PackageX, Settings, Search, RefreshCw, Upload, Check, BarChart3, Clock, Users, MousePointerClick, Smartphone, Monitor, Sparkles } from 'lucide-react';
import { getProducts, getCategories, addProduct, updateProduct, deleteProduct, updateSettings, uploadImage, addCategory, updateCategory, deleteCategory } from '../services/api';
import axios from 'axios';
import AdminSettingsTab from '../components/admin/AdminSettingsTab';
import AdminCategoriesTab from '../components/admin/AdminCategoriesTab';
import AdminProductsTab from '../components/admin/AdminProductsTab';
import AdminProductModal from '../components/admin/modals/AdminProductModal';
import AdminPriceModal from '../components/admin/modals/AdminPriceModal';
import AdminCategoryModal from '../components/admin/modals/AdminCategoryModal';

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
  const handleOpenProductModal = (product = null) => {
    if (product) {
      setEditingProduct(product);
      const origP = Number(product.originalPrice) || 0;
      const curP = Number(product.price) || 0;
      const calcDisc = origP > curP ? Math.round(((origP - curP) / origP) * 100) : '';

      setFormData({
        name: product.name || '',
        code: product.code || '',
        brand: product.brand || '',
        category: product.category || categories[0]?.name || '',
        subcategory: product.subcategory || '',
        originalPrice: product.originalPrice || '',
        discountPercent: calcDisc,
        price: product.price || '',
        offerEndDate: product.offerEndDate || '',
        offerNote: product.offerNote || '',
        priceUnit: product.priceUnit || 'متر مربع',
        boxCoverage: product.boxCoverage || '',
        dimensions: product.dimensions || '',
        finish: product.finish || '',
        grade: product.grade || '',
        origin: product.origin || '',
        usage: product.usage || '',
        description: product.description || '',
        image: product.image || '',
        inStock: product.inStock !== false,
        featured: Boolean(product.featured),
        hasVariants: Boolean(product.hasVariants),
        variants: Array.isArray(product.variants) ? product.variants : []
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        code: '',
        brand: '',
        category: categories[0]?.name || '',
        subcategory: (categories[0]?.subcategories && categories[0]?.subcategories[0]) || '',
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
        featured: false,
        hasVariants: false,
        variants: []
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
      showSuccess('تم رفع صورة الصنف الأساسية لـ Cloudinary بنجاح!');
    } catch (err) {
      console.error('Upload failed:', err);
      alert('فشل رفع الصورة');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleVariantImageUpload = async (e, vIdx) => {
    const file = e.target.files[0];
    if (!file) return;

    const data = new FormData();
    data.append('image', file);

    try {
      setUploadingImage(true);
      const res = await uploadImage(data);
      setFormData(prev => {
        const newVariants = [...prev.variants];
        newVariants[vIdx].image = res.data.imageUrl;
        return { ...prev, variants: newVariants };
      });
      showSuccess('تم رفع صورة الخيار بنجاح!');
    } catch (err) {
      console.error('Variant Upload failed:', err);
      alert('فشل رفع صورة الخيار');
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

  const handleResetAnalytics = async () => {
    if (window.confirm('هل أنت متأكد من تصفير جميع إحصائيات الزوار والواتساب والبدء من الصفر (0)؟')) {
      try {
        const res = await axios.post('/api/analytics/reset');
        setAnalyticsData(res.data.analytics);
        showSuccess('تم تصفير جميع الإحصائيات والبدء من الصفر (0) بنجاح!');
      } catch (err) {
        console.error('Reset analytics error:', err);
        alert('حدث خطأ أثناء تصفير الإحصائيات');
      }
    }
  };

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
            <AdminProductsTab 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              filterCategory={filterCategory} 
              setFilterCategory={setFilterCategory} 
              categories={categories} 
              fetchDashboardData={fetchDashboardData} 
              loading={loading} 
              filteredProducts={filteredProducts} 
              handleToggleStock={handleToggleStock} 
              handleOpenPriceModal={handleOpenPriceModal} 
              handleOpenProductModal={handleOpenProductModal} 
              handleDelete={handleDelete} 
            />
          </Tab>

          <Tab eventKey="settings" title="إعدادات المعرض والواتساب">
            <AdminSettingsTab 
              settingsForm={settingsForm} 
              setSettingsForm={setSettingsForm} 
              handleSettingsSubmit={handleSettingsSubmit} 
            />
          </Tab>

          <Tab eventKey="categories" title="إدارة تصنيفات المعرض">
            <AdminCategoriesTab 
              categories={categories} 
              handleOpenCategoryModal={handleOpenCategoryModal} 
              handleDeleteCategory={handleDeleteCategory} 
            />
          </Tab>
        </Tabs>
      </Container>

      {/* Add / Edit Product Modal */}
      <AdminProductModal
          uploadingImage={uploadingImage}
          handlePricingChange={handlePricingChange}
          handleImageUpload={handleImageUpload}
          handleVariantImageUpload={handleVariantImageUpload}
          showProductModal={showProductModal}
        setShowProductModal={setShowProductModal}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        handleProductSubmit={handleProductSubmit}
        categories={categories}
      />
      <AdminPriceModal
        showPriceModal={showPriceModal}
        setShowPriceModal={setShowPriceModal}
        priceProduct={priceProduct}
        newOriginalPrice={newOriginalPrice}
        setNewOriginalPrice={setNewOriginalPrice}
          newPrice={newPrice}
          setNewPrice={setNewPrice}
        handleSavePrice={handleSavePrice}
      />
      <AdminCategoryModal
        showCategoryModal={showCategoryModal}
        setShowCategoryModal={setShowCategoryModal}
        editingCategory={editingCategory}
        categoryFormData={categoryFormData}
        setCategoryFormData={setCategoryFormData}
        newSubcategory={newSubcategory}
        setNewSubcategory={setNewSubcategory}
        handleAddSubcategory={handleAddSubcategory}
        handleRemoveSubcategory={handleRemoveSubcategory}
        handleCategorySubmit={handleCategorySubmit}
      />
    </div>
  );
};

export default AdminDashboard;
