import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { MapPin, Phone, Clock, MessageSquare, Compass, Send, CheckCircle, ExternalLink } from 'lucide-react';

const Contact = ({ settings }) => {
  const [selectedBranchIdx, setSelectedBranchIdx] = useState(0);
  const branches = settings?.address?.split('|') || [];
  const whatsappNumber = settings?.whatsappNumber || '201001366499';
  const phoneNumber = settings?.phoneNumber || '01001366499';

  // Individual branch map links fallback
  const mapUrls = [
    settings?.mapUrl1 || 'https://www.google.com/maps/search/?api=1&query=%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%B9%D8%B7%D8%A7%D8%B1+%D9%85%D8%AF%D8%AE%D9%84+%D8%A8%D9%86%D9%87%D8%A7+%D8%A7%D9%84%D9%82%D8%A8%D9%84%D9%8A',
    settings?.mapUrl2 || settings?.mapUrl || 'https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&FORM=FBKPL1&q=%D8%A7%D9%84%D8%B9%D9%86%D9%88%D8%A7%D9%86%3A+%D8%A8%D9%86%D9%87%D8%A7+-%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%B3%D9%86%D9%87%D9%88%D9%89+%E2%80%93+%D8%A8%D8%AC%D9%88%D8%A7%D8%B1+%D9%83%D9%88%D8%A8%D8%B1%D9%8A+%D8%A7%D9%84%D8%B4%D9%85%D9%88%D8%AA%2C+Benha%2C+Egypt%2C+013&cp=30.460002%7E31.183300&lvl=13.4&style=r'
  ];

  // Form State
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    inquiryType: 'استفسار عن سعر صنف',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('يرجى ملء الحقول الإلزامية');
      return;
    }
    
    // Construct WhatsApp message with form details
    const text = `السلام عليكم ورحمة الله وبركاته 💐
طلب استفسار جديد من موقع مبيعات معرض السيد الجزار:

👤 *الاسم بالكامل:* ${formData.fullName}
📞 *رقم الواتساب/الهاتف:* ${formData.phone}
❓ *نوع الاستفسار:* ${formData.inquiryType}
✉️ *تفاصيل الطلب:* ${formData.message || 'أود معرفة الأسعار المتاحة وتوفر الأصناف بالمحل'}

يرجى التواصل معي لإفادتي بالتفاصيل ومواعيد المعاينة المتاحة بالمعرض. 🙏✨`;
                 
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    
    setSubmitted(true);
    setTimeout(() => {
      window.open(waUrl, '_blank');
      setSubmitted(false);
      setFormData({ fullName: '', phone: '', inquiryType: 'استفسار عن سعر صنف', message: '' });
    }, 1500);
  };

  return (
    <div className="contact-page-wrapper py-5">
      <Container>
        {/* Page Header */}
        <div className="text-center mb-5 animate-fade-in">
          <Badge bg="warning" text="dark" className="px-3 py-2 fs-6 mb-3 fw-bold shadow-sm">
            ✨ تواصل مباشر - معرض السيد الجزار للسيراميك والبورسلين
          </Badge>
          <h1 className="contact-main-title">احصل على استشارة وتواصل مباشرة</h1>
          <p className="contact-main-subtitle mx-auto">
            يسعدنا تواصلكم معنا للاستفسار عن المعروضات وأسعار الكميات، أو لطلب تحديد موعد زيارة للمعارض في مدينة بنها.
          </p>
        </div>

        <Row className="g-4 align-items-stretch">
          {/* Right Column: Contact Info & Branches (ADSAMY-inspired style) */}
          <Col lg={6}>
            <div className="h-100 d-flex flex-column justify-content-between gap-4">
              
              {/* Contact info grid */}
              <div className="d-flex flex-column gap-3">
                <h3 className="section-subtitle-gold mb-3">📞 قنوات الاتصال المباشرة</h3>

                {/* Hotline Info Box */}
                <div className="adsamy-info-box">
                  <div className="adsamy-icon-wrapper hotline-color">
                    <Phone size={22} />
                  </div>
                  <div className="flex-grow-1">
                    <span className="adsamy-info-label d-block">الخط الساخن والمبيعات</span>
                    <a href={`tel:${phoneNumber}`} className="adsamy-info-value">
                      {phoneNumber}
                    </a>
                  </div>
                </div>

                {/* WhatsApp Info Box */}
                <div className="adsamy-info-box">
                  <div className="adsamy-icon-wrapper whatsapp-color">
                    <MessageSquare size={22} />
                  </div>
                  <div className="flex-grow-1">
                    <span className="adsamy-info-label d-block">المراسلة الفورية عبر واتساب</span>
                    <a href={`https://wa.me/${whatsappNumber}`} target="_blank" rel="noopener noreferrer" className="adsamy-info-value">
                      {whatsappNumber}
                    </a>
                  </div>
                </div>
              </div>

              {/* Showroom Branches with Get Directions CTA */}
              <div className="mt-3">
                <h3 className="section-subtitle-gold mb-3">📍 فروع المعرض وعناوينها</h3>
                <div className="d-flex flex-column gap-3">
                  {branches.map((branch, idx) => (
                    <div 
                      key={idx} 
                      className={`adsamy-branch-card ${selectedBranchIdx === idx ? 'border-warning' : ''}`}
                      onClick={() => setSelectedBranchIdx(idx)}
                      style={{ 
                        cursor: 'pointer', 
                        borderWidth: selectedBranchIdx === idx ? '2px' : '1px',
                        borderColor: selectedBranchIdx === idx ? 'var(--primary-gold)' : '#e2e8f0',
                        boxShadow: selectedBranchIdx === idx ? '0 8px 20px rgba(197, 160, 89, 0.15)' : 'none',
                        transition: 'all 0.2s ease'
                      }}
                    >
                      <div className="d-flex gap-3 align-items-start">
                        <div className="adsamy-branch-icon">
                          <MapPin size={20} className="text-warning" />
                        </div>
                        <div className="flex-grow-1">
                          <div className="d-flex justify-content-between align-items-center mb-1">
                            <h6 className="branch-title-text mb-0">الفرع {idx + 1}</h6>
                            {selectedBranchIdx === idx && (
                              <Badge bg="warning" text="dark" className="small" style={{ fontSize: '0.7rem' }}>🗺️ معروض على الخريطة</Badge>
                            )}
                          </div>
                          <p className="branch-address-text text-muted mb-2">{branch.replace(/^فرع \d+:\s*/i, '').trim()}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <span className="branch-hours-text text-muted small">
                              <Clock size={14} className="me-1" />
                              العمل: {settings?.workingHours || '10:00 ص - 11:30 م'}
                            </span>
                            {mapUrls[idx] && (
                              <a 
                                href={mapUrls[idx]} 
                                target="_blank" 
                                rel="noopener noreferrer" 
                                className="btn-get-directions"
                                onClick={(e) => e.stopPropagation()} // Prevent card selection click trigger when clicking the anchor
                              >
                                <Compass size={14} />
                                احصل على الاتجاهات
                              </a>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          </Col>

          {/* Left Column: Interactive Contact Form (ADSAMY-inspired style) */}
          <Col lg={6}>
            <Card className="adsamy-form-card shadow-lg h-100 border-0">
              <Card.Body className="p-4 p-md-5 d-flex flex-column justify-content-center">
                <div className="form-header mb-4">
                  <h3 className="form-title text-white fw-bold">📨 أرسل استفسارك الآن</h3>
                  <p className="text-muted small">املأ بياناتك وسنقوم بالتواصل معك فوراً لتلبية احتياجات تشطيب شقتك.</p>
                </div>

                {submitted ? (
                  <div className="text-center py-5 form-success-state">
                    <CheckCircle size={64} className="text-success mb-3" />
                    <h4 className="fw-bold text-white mb-2">تم تجهيز طلبك بنجاح!</h4>
                    <p className="text-muted">جاري فتح تطبيق الواتساب لإرسال استفسارك مباشرة للمبيعات...</p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit} className="adsamy-form">
                    {/* Full Name */}
                    <Form.Group className="mb-3" controlId="fullName">
                      <Form.Label className="text-muted small">الاسم بالكامل *</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="أدخل اسمك الكريم..." 
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="adsamy-input"
                      />
                    </Form.Group>

                    {/* Phone Number */}
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label className="text-muted small">رقم الهاتف (الواتساب) *</Form.Label>
                      <Form.Control 
                        type="tel" 
                        placeholder="أدخل رقم الهاتف لتواصل المبيعات..." 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="adsamy-input"
                      />
                    </Form.Group>

                    {/* Inquiry Type */}
                    <Form.Group className="mb-3" controlId="inquiryType">
                      <Form.Label className="text-muted small">نوع الاستفسار</Form.Label>
                      <Form.Select 
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="adsamy-input select-arrow"
                      >
                        <option value="استفسار عن سعر صنف">استفسار عن أسعار وتوافر أصناف</option>
                        <option value="طلب عرض سعر كمية">طلب عرض سعر لكمية (فيلا / شقة)</option>
                        <option value="حجز موعد زيارة للمعرض">حجز موعد زيارة لمعاينة عينات</option>
                        <option value="أخرى">استفسارات أخرى</option>
                      </Form.Select>
                    </Form.Group>

                    {/* Inquiry Details */}
                    <Form.Group className="mb-4" controlId="message">
                      <Form.Label className="text-muted small">تفاصيل الاستفسار أو كود الموديل</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={4} 
                        placeholder="اكتب هنا تفاصيل طلبك (مثل: المساحة المطلوبة، الموديل المفضل، أو أي ملاحظات)..." 
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="adsamy-input"
                      />
                    </Form.Group>

                    {/* Submit Button */}
                    <Button 
                      type="submit" 
                      className="btn-adsamy-submit w-100 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    >
                      <Send size={18} />
                      إرسال الاستفسار الفوري عبر واتساب
                    </Button>
                  </Form>
                )}
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Styled Full-Width Map Integration (Dynamic Google Maps Iframe Embed) */}
        {branches.length > 0 && (
          <div className="adsamy-map-wrapper mt-5 animate-fade-in">
            <h4 className="fw-bold text-dark mb-3 text-center text-md-end">
              🗺️ موقع {selectedBranchIdx === 0 ? 'الفرع الأول' : 'الفرع الثاني'} على الخريطة
            </h4>
            <div className="position-relative overflow-hidden rounded-4 border shadow-sm" style={{ height: '400px', backgroundColor: '#f1f5f9' }}>
              <iframe
                src={`https://maps.google.com/maps?q=${encodeURIComponent(branches[selectedBranchIdx] ? branches[selectedBranchIdx].replace(/^فرع \d+:\s*/i, '').trim() : '')}&t=&z=15&ie=UTF8&iwloc=&output=embed`}
                width="100%"
                height="100%"
                style={{ border: 0 }}
                allowFullScreen=""
                loading="lazy"
                title={`موقع الفرع ${selectedBranchIdx + 1}`}
              ></iframe>
            </div>
            
            <div className="text-center text-md-end mt-3">
              <a 
                href={mapUrls[selectedBranchIdx]} 
                target="_blank" 
                rel="noopener noreferrer"
                className="btn btn-outline-warning rounded-pill px-4 py-2 fw-bold text-dark border-2"
                style={{ transition: 'all 0.2s' }}
              >
                <Compass size={18} className="me-2" />
                فتح {selectedBranchIdx === 0 ? 'الفرع الأول' : 'الفرع الثاني'} في تطبيق خرائط Google الخارجية
              </a>
            </div>
          </div>
        )}
      </Container>
    </div>
  );
};

export default Contact;
