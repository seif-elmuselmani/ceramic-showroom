import React from 'react';
import { Card, Row, Col, InputGroup, Form, Button, Spinner, Badge, Table } from 'react-bootstrap';
import { Search, RefreshCw, DollarSign, Edit, Trash2 } from 'lucide-react';

const AdminProductsTab = ({
  searchTerm, setSearchTerm, filterCategory, setFilterCategory,
  categories, fetchDashboardData, loading, filteredProducts,
  handleToggleStock, handleOpenPriceModal, handleOpenProductModal, handleDelete
}) => {
  return (
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
  );
};

export default AdminProductsTab;
