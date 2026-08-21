import React from 'react';
import { Card, Form, Button, Row, Col } from 'react-bootstrap';
import { Settings, Building, MessageSquare, MapPin, Save, Phone, Facebook, Clock, Megaphone } from 'lucide-react';

const AdminSettingsTab = ({ settingsForm, setSettingsForm, handleSettingsSubmit }) => {
  return (
    <Form onSubmit={handleSettingsSubmit} className="pb-5">
      <Row className="g-4">
        {/* General Info Card */}
        <Col xl={12}>
          <Card className="admin-card border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold d-flex align-items-center gap-2 text-dark m-0">
                <Building className="text-primary" size={22} />
                الهوية الأساسية للمعرض
              </h5>
              <p className="text-muted small mt-1 mb-0">المعلومات الرئيسية التي تظهر للزوار في رأس الصفحة</p>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">اسم المعرض الرسمي <span className="text-danger">*</span></Form.Label>
                    <Form.Control
                      type="text"
                      value={settingsForm.showroomName || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, showroomName: e.target.value })}
                      className="custom-input bg-light"
                      required
                    />
                  </Form.Group>
                </Col>
                
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">الشعار أو الوصف الفرعي للمجال</Form.Label>
                    <Form.Control
                      type="text"
                      value={settingsForm.tagline || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                      className="custom-input bg-light"
                      placeholder="مثال: الوكيل المعتمد لأرقى الماركات العالمية"
                    />
                  </Form.Group>
                </Col>

                <Col xs={12}>
                  <Form.Group>
                    <Form.Label className="fw-bold small text-secondary d-flex align-items-center gap-1">
                      <Megaphone size={16} className="text-warning" />
                      شريط الإعلانات والخصومات العلوية (يظهر أعلى الموقع)
                    </Form.Label>
                    <Form.Control
                      type="text"
                      value={settingsForm.announcement || ''}
                      onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                      className="custom-input bg-light border-warning border-opacity-50"
                      placeholder="مثال: 🔥 خصومات تصل إلى 50% بمناسبة الافتتاح!"
                    />
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Contact & Social Card */}
        <Col xl={12}>
          <Card className="admin-card border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4">
              <h5 className="fw-bold d-flex align-items-center gap-2 text-dark m-0">
                <MessageSquare className="text-success" size={22} />
                التواصل والسوشيال ميديا
              </h5>
              <p className="text-muted small mt-1 mb-0">أرقام التواصل وحسابات السوشيال ميديا الخاصة بالمعرض</p>
            </Card.Header>
            <Card.Body className="p-4">
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">
                      رقم الواتساب للطلبات المباشرة <span className="text-success small fw-normal">(صيغة دولية بدون +)</span>
                    </Form.Label>
                    <div className="position-relative">
                      <MessageSquare size={18} className="position-absolute top-50 translate-middle-y text-success" style={{ right: '12px' }} />
                      <Form.Control
                        type="text"
                        value={settingsForm.whatsappNumber || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                        className="custom-input bg-light"
                        style={{ paddingRight: '40px', direction: 'ltr', textAlign: 'left' }}
                        placeholder="مثال: 201012345678"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">رقم الهاتف الأرضي / المبيعات</Form.Label>
                    <div className="position-relative">
                      <Phone size={18} className="position-absolute top-50 translate-middle-y text-muted" style={{ right: '12px' }} />
                      <Form.Control
                        type="text"
                        value={settingsForm.phoneNumber || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })}
                        className="custom-input bg-light"
                        style={{ paddingRight: '40px', direction: 'ltr', textAlign: 'left' }}
                        placeholder="مثال: 0133221144"
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">رابط صفحة فيسبوك (Facebook)</Form.Label>
                    <div className="position-relative">
                      <Facebook size={18} className="position-absolute top-50 translate-middle-y text-primary" style={{ right: '12px' }} />
                      <Form.Control
                        type="url"
                        value={settingsForm.facebookUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                        className="custom-input bg-light"
                        style={{ paddingRight: '40px', direction: 'ltr', textAlign: 'left' }}
                        placeholder="https://www.facebook.com/..."
                      />
                    </div>
                  </Form.Group>
                </Col>

                <Col md={6}>
                  <Form.Group>
                    <Form.Label className="fw-bold small text-secondary">رابط حساب تيك توك (TikTok)</Form.Label>
                    <div className="position-relative">
                      <div className="position-absolute top-50 translate-middle-y text-dark fw-bold d-flex align-items-center justify-content-center" style={{ right: '12px', width: '18px', height: '18px' }}>
                        <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
                          <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                        </svg>
                      </div>
                      <Form.Control
                        type="url"
                        value={settingsForm.tiktokUrl || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                        className="custom-input bg-light"
                        style={{ paddingRight: '40px', direction: 'ltr', textAlign: 'left' }}
                        placeholder="https://www.tiktok.com/@..."
                      />
                    </div>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>

        {/* Branches & Maps Card */}
        <Col xl={12}>
          <Card className="admin-card border-0 shadow-sm rounded-4 overflow-hidden">
            <Card.Header className="bg-white border-bottom-0 pt-4 pb-0 px-4 d-flex justify-content-between align-items-center flex-wrap">
              <div>
                <h5 className="fw-bold d-flex align-items-center gap-2 text-dark m-0">
                  <MapPin className="text-danger" size={22} />
                  الفروع ومواقع الـ GPS ومواعيد العمل
                </h5>
                <p className="text-muted small mt-1 mb-0">العناوين الدقيقة وروابط خرائط جوجل لتسهيل وصول العملاء</p>
              </div>
              <div className="d-flex align-items-center gap-2 mt-2 mt-sm-0 bg-light px-3 py-2 rounded-pill border">
                <Clock size={16} className="text-warning" />
                <Form.Control
                  type="text"
                  value={settingsForm.workingHours || ''}
                  onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                  className="border-0 bg-transparent p-0 m-0 shadow-none fw-bold text-dark fs-7"
                  style={{ width: '180px' }}
                  placeholder="مثال: يومياً من 10 ص إلى 10 م"
                />
              </div>
            </Card.Header>
            
            <Card.Body className="p-4">
              <Row className="g-4">
                {/* Branch 1 */}
                <Col md={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <h6 className="fw-bold text-primary mb-3 d-flex align-items-center gap-2">
                      <span className="badge bg-primary rounded-circle p-1">1</span> فرع برج العطار
                    </h6>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">العنوان بالتفصيل</Form.Label>
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
                        className="custom-input bg-white"
                        placeholder="مثال: مدخل بنها القبلي - بجوار بنك مصر"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-secondary">رابط خريطة جوجل (Google Maps)</Form.Label>
                      <Form.Control
                        type="url"
                        value={settingsForm.mapUrl1 || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl1: e.target.value })}
                        className="custom-input bg-white"
                        style={{ direction: 'ltr', textAlign: 'left' }}
                        placeholder="https://maps.google.com/..."
                      />
                    </Form.Group>
                  </div>
                </Col>

                {/* Branch 2 */}
                <Col md={6}>
                  <div className="p-3 bg-light rounded-3 border">
                    <h6 className="fw-bold text-danger mb-3 d-flex align-items-center gap-2">
                      <span className="badge bg-danger rounded-circle p-1">2</span> فرع كوبري الشموت
                    </h6>
                    <Form.Group className="mb-3">
                      <Form.Label className="small fw-bold text-secondary">العنوان بالتفصيل</Form.Label>
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
                        className="custom-input bg-white"
                        placeholder="مثال: برج السنهوي - أسفل كوبري الشموت"
                      />
                    </Form.Group>
                    <Form.Group>
                      <Form.Label className="small fw-bold text-secondary">رابط خريطة جوجل (Google Maps)</Form.Label>
                      <Form.Control
                        type="url"
                        value={settingsForm.mapUrl2 || ''}
                        onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl2: e.target.value })}
                        className="custom-input bg-white"
                        style={{ direction: 'ltr', textAlign: 'left' }}
                        placeholder="https://maps.google.com/..."
                      />
                    </Form.Group>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Floating Save Button Area */}
      <div className="mt-4 d-flex justify-content-end position-sticky bottom-0 pb-3" style={{ zIndex: 10 }}>
        <Button 
          type="submit" 
          variant="success" 
          size="lg" 
          className="rounded-pill px-5 shadow-lg d-flex align-items-center gap-2 fw-bold admin-btn-glow"
          style={{ transition: 'all 0.3s' }}
        >
          <Save size={20} />
          حفظ جميع التعديلات والإعدادات
        </Button>
      </div>
    </Form>
  );
};

export default AdminSettingsTab;
