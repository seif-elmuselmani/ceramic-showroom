import React from 'react';
import { Modal, Form, Row, Col, InputGroup, Button, Badge, Spinner } from 'react-bootstrap';
import { Save, PlusCircle, CheckCircle2, ShieldCheck, Award, XCircle, Trash2, Sparkles, Image, Info } from 'lucide-react';

const AdminProductModal = ({ showProductModal, setShowProductModal, editingProduct, formData, setFormData, handleProductSubmit, categories, uploadingImage, handlePricingChange, handleImageUpload, handleVariantImageUpload }) => {
  const handleAddVariant = () => {
    setFormData(prev => ({
      ...prev,
      hasVariants: true,
      variants: [...(prev.variants || []), { color: '', coverType: '', price: '', originalPrice: '' }]
    }));
  };

  const handleUpdateVariant = (index, field, value) => {
    setFormData(prev => {
      const newVariants = [...(prev.variants || [])];
      newVariants[index] = { ...newVariants[index], [field]: value };
      return { ...prev, variants: newVariants };
    });
  };

  const handleRemoveVariant = (index) => {
    setFormData(prev => {
      const newVariants = (prev.variants || []).filter((_, i) => i !== index);
      return { ...prev, hasVariants: newVariants.length > 0, variants: newVariants };
    });
  };

  return (
<>
      <Modal show={showProductModal} onHide={() => setShowProductModal(false)} size="lg" centered scrollable className="modal-luxury">
        <Modal.Header closeButton bg="dark" className="bg-dark text-white border-bottom border-warning">
          <Modal.Title className="fw-bold fs-6">
            {editingProduct ? `تعديل: ${editingProduct.name}` : 'إضافة صنف سيراميك / بورسلين جديد'}
          </Modal.Title>
        </Modal.Header>

        <Modal.Body className="p-0">
          <Form id="product-form" onSubmit={handleProductSubmit} className="p-3">
            <Row className="g-4">
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

              {/* Interactive Product Variants Builder Section */}
              <Col xs={12}>
                <div className="p-3 bg-light rounded-4 border shadow-sm mb-2">
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <h6 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                        <Sparkles size={18} className="text-warning" />
                        🎨 خيارات ومتغيرات الصنف (الألوان وأنواع الغطاء والأسعار)
                      </h6>
                      <small className="text-muted">مفيدة للأطقم والقواعد والوحدات (اختياري 100% - اتركها فارغة للسيراميك)</small>
                    </div>
                    <Form.Check
                      type="switch"
                      id="variants-toggle-switch"
                      label={formData.hasVariants ? 'تفعيل الخيارات ✅' : 'بدون خيارات ❌'}
                      checked={formData.hasVariants}
                      onChange={(e) => {
                        const isChecked = e.target.checked;
                        if (isChecked && formData.variants.length === 0) {
                          handleAddVariant();
                        } else {
                          setFormData({ ...formData, hasVariants: isChecked });
                        }
                      }}
                      className="fw-bold text-primary"
                    />
                  </div>

                  {formData.hasVariants && (
                    <div className="mt-3">
                      <div className="table-responsive rounded-4 border shadow-sm" style={{ maxHeight: '350px', overflowY: 'auto' }}>
                        <table className="table table-borderless table-hover align-middle mb-0" style={{ minWidth: '700px' }}>
                          <thead className="bg-light sticky-top" style={{ zIndex: 1 }}>
                            <tr>
                              <th className="text-muted fw-bold fs-8 py-3 text-center">#</th>
                              <th className="text-muted fw-bold fs-8 py-3">اللون</th>
                              <th className="text-muted fw-bold fs-8 py-3">نوع الغطاء</th>
                              <th className="text-muted fw-bold fs-8 py-3">السعر</th>
                              <th className="text-muted fw-bold fs-8 py-3">السعر القديم</th>
                              <th className="text-muted fw-bold fs-8 py-3">صورة مخصصة</th>
                              <th className="text-muted fw-bold fs-8 py-3 text-center">حذف</th>
                            </tr>
                          </thead>
                          <tbody className="bg-white">
                            {formData.variants.length === 0 ? (
                              <tr>
                                <td colSpan="7" className="text-center text-muted py-5 border-bottom-0">
                                  <div className="d-flex flex-column align-items-center gap-2">
                                    <Sparkles size={24} className="text-slate-300" />
                                    <span className="fw-bold text-slate-400">لم تقم بإضافة أي خيارات بعد</span>
                                  </div>
                                </td>
                              </tr>
                            ) : (
                              formData.variants.map((vItem, vIdx) => (
                                <tr key={vItem.id || vIdx} className="border-bottom border-light">
                                  <td className="text-center"><Badge bg="dark" className="rounded-circle px-2 py-1 fs-9 shadow-sm">{vIdx + 1}</Badge></td>
                                  <td>
                                    <Form.Control type="text" placeholder="مثال: أسود" value={vItem.color || ''} onChange={(e) => handleUpdateVariant(vIdx, 'color', e.target.value)} className="bg-light border-0 shadow-none fs-7 fw-bold" style={{ borderRadius: '8px' }} />
                                  </td>
                                  <td>
                                    <Form.Control type="text" placeholder="مثال: هيدروليك" value={vItem.coverType || ''} onChange={(e) => handleUpdateVariant(vIdx, 'coverType', e.target.value)} className="bg-light border-0 shadow-none fs-7 fw-bold" style={{ borderRadius: '8px' }} />
                                  </td>
                                  <td style={{width: '110px'}}>
                                    <Form.Control type="number" placeholder="0" value={vItem.price || ''} onChange={(e) => handleUpdateVariant(vIdx, 'price', e.target.value)} className="bg-light border-0 shadow-none fs-7 text-success fw-bold" style={{ borderRadius: '8px' }} />
                                  </td>
                                  <td style={{width: '110px'}}>
                                    <Form.Control type="number" placeholder="0" value={vItem.originalPrice || ''} onChange={(e) => handleUpdateVariant(vIdx, 'originalPrice', e.target.value)} className="bg-light border-0 shadow-none fs-7 text-muted" style={{ borderRadius: '8px' }} />
                                  </td>
                                  <td style={{width: '200px'}}>
                                    <div className="d-flex align-items-center gap-2">
                                      {vItem.image && <img src={vItem.image} alt="variant" className="rounded-3 border" style={{width: '32px', height: '32px', objectFit: 'cover'}} />}
                                      <Form.Control 
                                        type="file" 
                                        size="sm"
                                        accept="image/*"
                                        onChange={(e) => handleVariantImageUpload(e, vIdx)} 
                                        className="bg-light border-0 shadow-none text-muted" 
                                        style={{ borderRadius: '8px', fontSize: '11px' }} 
                                        disabled={uploadingImage}
                                      />
                                    </div>
                                  </td>
                                  <td className="text-center">
                                    <Button variant="light" className="p-2 rounded-circle text-danger hover-bg-danger hover-text-white transition-all border-0 shadow-sm" onClick={() => handleRemoveVariant(vIdx)} title="حذف">
                                      <Trash2 size={16} />
                                    </Button>
                                  </td>
                                </tr>
                              ))
                            )}
                          </tbody>
                        </table>
                      </div>
                      <Button variant="dark" onClick={handleAddVariant} className="fw-bold mt-3 shadow-sm rounded-pill px-4 py-2 fs-7 d-flex align-items-center gap-2">
                        <PlusCircle size={16} /> إضافة خيار جديد
                      </Button>
                    </div>
                  )}
                </div>
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
          </Form>
            </Modal.Body>

          <Modal.Footer className="bg-light p-3 border-top">
            <Button variant="secondary" className="rounded-pill px-4" onClick={() => setShowProductModal(false)}>إلغاء</Button>
            <Button type="submit" form="product-form" className="admin-btn rounded-pill px-4 py-2 shadow-sm fw-bold">
              {editingProduct ? 'حفظ التعديلات' : 'إضافة الصنف'}
            </Button>
          </Modal.Footer>
      </Modal>

      {/* Quick Price Modal */}
</>
  );
};
export default AdminProductModal;