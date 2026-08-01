import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Table, Button, Form, Modal, Badge, Tab, Tabs, Alert, Spinner, InputGroup } from 'react-bootstrap';
import { PlusCircle, Edit, Trash2, Layers, DollarSign, PackageCheck, PackageX, Settings, Search, RefreshCw, Upload, Check, Calculator } from 'lucide-react';
import { getProducts, getCategories, addProduct, updateProduct, deleteProduct, updateSettings, uploadImage } from '../services/api';

const AdminDashboard = ({ settings, onSettingsUpdated }) => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
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

  // Modal State for Quick Price Edit
  const [showPriceModal, setShowPriceModal] = useState(false);
  const [priceProduct, setPriceProduct] = useState(null);
  const [newPrice, setNewPrice] = useState('');

  // Settings State
  const [settingsForm, setSettingsForm] = useState(settings || {});

  useEffect(() => {
    fetchDashboardData();
  }, []);

  useEffect(() => {
    if (settings) setSettingsForm(settings);
  }, [settings]);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      setError('');
      const [prodRes, catRes] = await Promise.all([
        getProducts(),
        getCategories()
      ]);
      setProducts(prodRes.data);
      setCategories(catRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
      setError('حدث خطأ أثناء تحميل البيانات من خادم البيانات.');
    } finally {
      setLoading(false);
    }
  };

  const showSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4500);
  };

  // Handle Add or Edit Open
  const handleOpenProductModal = (prod = null) => {
    if (prod) {
      setEditingProduct(prod);
      setFormData({
        name: prod.name || '',
        code: prod.code || '',
        category: prod.category || 'بورسلين مستورد',
        price: prod.price || '',
        priceUnit: prod.priceUnit || 'متر مربع',
        boxCoverage: prod.boxCoverage || '1.44',
        dimensions: prod.dimensions || '',
        finish: prod.finish || 'لامع / كريستال',
        grade: prod.grade || 'فرز أول ممتاز',
        origin: prod.origin || 'مصر',
        usage: prod.usage || '',
        description: prod.description || '',
        image: prod.image || '',
        inStock: prod.inStock ?? true,
        featured: prod.featured ?? false
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        code: 'SER-' + Math.floor(1000 + Math.random() * 9000),
        category: categories[0]?.name || 'بورسلين مستورد',
        price: '',
        priceUnit: 'متر مربع',
        boxCoverage: '1.44',
        dimensions: '60x120 سم',
        finish: 'لامع / كريستال عاكس',
        grade: 'فرز أول ممتاز',
        origin: 'إسبانيا',
        usage: 'أرضيات ريسبشن وصالونات',
        description: '',
        image: 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=800&q=80',
        inStock: true,
        featured: false
      });
    }
    setShowProductModal(true);
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
      showSuccess('تم رفع صورة الصنف بنجاح!');
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
      const payload = {
        ...formData,
        price: Number(formData.price),
        boxCoverage: Number(formData.boxCoverage) || 1.44
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
    setNewPrice(prod.price);
    setShowPriceModal(true);
  };

  const handleSavePrice = async () => {
    if (!priceProduct || !newPrice) return;
    try {
      await updateProduct(priceProduct.id, { price: Number(newPrice) });
      showSuccess(`تم تحديث سعر "${priceProduct.name}" إلى ${newPrice} ج.م/م² بنجاح`);
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
      await updateProduct(prod.id, { inStock: !prod.inStock });
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

  // Filter products for table
  const filteredProducts = products.filter(p => {
    const matchesCategory = filterCategory === 'الكل' || p.category === filterCategory;
    const matchesSearch = !searchTerm || 
      p.name.toLowerCase().includes(searchTerm.toLowerCase()) || 
      p.code.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const totalInStock = products.filter(p => p.inStock).length;
  const totalOutOfStock = products.length - totalInStock;

  return (
    <div className="pb-5">
      {/* Dashboard Top Header */}
      <div className="admin-header">
        <Container>
          <div className="d-flex flex-wrap justify-content-between align-items-center gap-3">
            <div>
              <h2 className="fw-bold mb-1 d-flex align-items-center gap-2">
                <Layers className="text-warning" size={30} />
                لوحة تحكم إدارة السيراميك والبورسلين
              </h2>
              <p className="text-muted small mb-0">إدارة أصناف الكتالوج، تحديث أسعار المتر، وإعدادات تواصل الواتساب والمعرض</p>
            </div>
            
            <Button 
              className="admin-btn d-flex align-items-center gap-2"
              onClick={() => handleOpenProductModal()}
            >
              <PlusCircle size={20} />
              إضافة صنف جديد للمعرض
            </Button>
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
        <Row className="g-4 mb-4">
          <Col md={4}>
            <div className="stat-box">
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">إجمالي الأصناف بالكتالوج</div>
                  <div className="fs-2 fw-black text-dark">{products.length}</div>
                </div>
                <Layers className="text-warning" size={36} />
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="stat-box" style={{ borderRightColor: '#059669' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">أصناف متوفرة بالمعرض</div>
                  <div className="fs-2 fw-black text-success">{totalInStock}</div>
                </div>
                <PackageCheck className="text-success" size={36} />
              </div>
            </div>
          </Col>
          <Col md={4}>
            <div className="stat-box" style={{ borderRightColor: '#dc2626' }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <div className="text-muted small fw-bold">أصناف غير متوفرة / حجز</div>
                  <div className="fs-2 fw-black text-danger">{totalOutOfStock}</div>
                </div>
                <PackageX className="text-danger" size={36} />
              </div>
            </div>
          </Col>
        </Row>

        {/* Dashboard Tabs */}
        <Tabs defaultActiveKey="products" className="mb-4 custom-tabs">
          <Tab eventKey="products" title="إدارة الأصناف والأسعار والكراتين">
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

                <Col md={4}>
                  <Form.Select 
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="custom-input"
                  >
                    <option value="الكل">جميع الفئات</option>
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </Form.Select>
                </Col>

                <Col md={2} className="text-end">
                  <Button variant="outline-secondary" onClick={fetchDashboardData} className="w-100 rounded-3">
                    <RefreshCw size={16} /> تحديث
                  </Button>
                </Col>
              </Row>

              {loading ? (
                <div className="text-center py-5">
                  <Spinner animation="border" variant="warning" />
                  <p className="mt-2 text-muted">جاري تحميل أصناف الكتالوج...</p>
                </div>
              ) : (
                <div className="table-responsive">
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
                              <Badge bg="secondary" className="mb-1">{prod.category}</Badge>
                              <div className="small text-muted">🌍 {prod.origin || 'مصر'}</div>
                            </td>
                            <td>
                              <div className="fw-bold text-success fs-5">{prod.price} ج.م</div>
                              <div className="small text-muted">لكل {prod.priceUnit || 'م²'}</div>
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
              )}
            </Card>
          </Tab>

          <Tab eventKey="settings" title="إعدادات المعرض والتواصل والواتساب">
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
                  <Form.Text className="text-muted">عندما يضغط الزائر على "تواصل عبر الواتساب" أو "احسب الأمتار"، تصله الرسالة على هذا الرقم.</Form.Text>
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
                  <Form.Label className="fw-bold">عنوان الفرع والمعرض الرئيسي</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.address || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, address: e.target.value })}
                    className="custom-input"
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
        </Tabs>
      </Container>

      {/* Add / Edit Product Modal */}
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg" centered>
        <Modal.Header closeButton bg="dark" className="bg-dark text-white border-bottom border-warning">
          <Modal.Title className="fw-bold">
            {editingProduct ? `تعديل بيانات: ${editingProduct.name}` : 'إضافة صنف سيراميك / بورسلين جديد'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleProductSubmit}>
          <Modal.Body className="p-4">
            <Row className="g-3">
              <Col md={8}>
                <Form.Group>
                  <Form.Label className="fw-bold">اسم الصنف</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: بورسلين إسباني كالاكاتا جولدن 60x120"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">كود الصنف (Unique Code)</Form.Label>
                  <Form.Control
                    type="text"
                    required
                    value={formData.code}
                    onChange={(e) => setFormData({ ...formData, code: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">الفئة الرئيسية</Form.Label>
                  <Form.Select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="custom-input"
                  >
                    {categories.map(c => <option key={c.id} value={c.name}>{c.name}</option>)}
                  </Form.Select>
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">السعر (بالجنيه المصري)</Form.Label>
                  <Form.Control
                    type="number"
                    required
                    step="0.5"
                    value={formData.price}
                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">تغطية الكرتونة الواحدة (م²)</Form.Label>
                  <Form.Control
                    type="number"
                    step="0.01"
                    required
                    value={formData.boxCoverage}
                    onChange={(e) => setFormData({ ...formData, boxCoverage: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: 1.44"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">الأبعاد والمقاس</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.dimensions}
                    onChange={(e) => setFormData({ ...formData, dimensions: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: 60x120 سم"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">نوع التشطيب / اللمعة</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.finish}
                    onChange={(e) => setFormData({ ...formData, finish: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: لامع / مط / خشبي"
                  />
                </Form.Group>
              </Col>

              <Col md={4}>
                <Form.Group>
                  <Form.Label className="fw-bold">بلد المنشأ / الشركة</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.origin}
                    onChange={(e) => setFormData({ ...formData, origin: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: إسبانيا / مصر (كليوباترا)"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">رابط صورة المنتج (Image URL)</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.image}
                    onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold">أو قم برفع صورة جديدة</Form.Label>
                  <Form.Control
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="custom-input"
                    disabled={uploadingImage}
                  />
                  {uploadingImage && <span className="small text-muted">جاري رفع الصورة...</span>}
                </Form.Group>
              </Col>

              <Col md={12}>
                <Form.Group>
                  <Form.Label className="fw-bold">الاستخدام المقترح ووصف الصنف</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                    className="custom-input"
                    placeholder="اكتب مواصفات أو نصائح استخدام هذا السيراميك..."
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="stock-switch"
                  label="الصنف متوفر بالمخزن والمعرض حالياً"
                  checked={formData.inStock}
                  onChange={(e) => setFormData({ ...formData, inStock: e.target.checked })}
                  className="fw-bold"
                />
              </Col>

              <Col md={6}>
                <Form.Check
                  type="switch"
                  id="featured-switch"
                  label="تمييز الصنف في الصفحة الرئيسية"
                  checked={formData.featured}
                  onChange={(e) => setFormData({ ...formData, featured: e.target.checked })}
                  className="fw-bold"
                />
              </Col>
            </Row>
          </Modal.Body>

          <Modal.Footer className="bg-light">
            <Button variant="secondary" onClick={() => setShowProductModal(false)}>إلغاء</Button>
            <Button type="submit" className="admin-btn px-4">
              {editingProduct ? 'حفظ التعديلات' : 'إضافة الصنف'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

      {/* Quick Price Modal */}
      <Modal show={showPriceModal} onHide={() => setShowPriceModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6">تحديث سعر الصنف</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {priceProduct && (
            <div>
              <p className="small text-muted mb-2">الصنف: <strong>{priceProduct.name}</strong></p>
              <Form.Group>
                <Form.Label className="fw-bold">السعر الجديد (ج.م/م²):</Form.Label>
                <Form.Control
                  type="number"
                  step="0.5"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="custom-input fs-5 fw-bold text-success"
                  autoFocus
                />
              </Form.Group>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowPriceModal(false)}>إلغاء</Button>
          <Button variant="success" size="sm" onClick={handleSavePrice} className="px-3 fw-bold">تحديث السعر</Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default AdminDashboard;
