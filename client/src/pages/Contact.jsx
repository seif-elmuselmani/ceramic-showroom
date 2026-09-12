import React, { useState } from 'react';
import { Container, Row, Col, Card, Form, Button, Badge } from 'react-bootstrap';
import { MapPin, Phone, Clock, MessageSquare, Compass, Send, CheckCircle2, Sparkles, PhoneCall, ShieldCheck, Award, MessageCircle } from 'lucide-react';

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
    inquiryType: 'استفسار عن سعر صنف وتوافره',
    message: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.fullName || !formData.phone) {
      alert('يرجى إدخال الاسم ورقم الهاتف للتواصل');
      return;
    }
    
    // Construct WhatsApp message with form details
    const text = `السلام عليكم ورحمة الله وبركاته 💐
طلب استفسار واستشارة جديدة من موقع معرض السيد الجزار:

👤 *الاسم بالكامل:* ${formData.fullName}
📞 *رقم الهاتف / الواتساب:* ${formData.phone}
❓ *نوع الاستفسار:* ${formData.inquiryType}
✉️ *تفاصيل الطلب:* ${formData.message || 'أود معرفة أفضل الأسعار وتوفر الأصناف بالمعرض'}

يرجى التواصل معي لإفادتي بالتفاصيل ومواعيد المعاينة المتاحة. 🙏✨`;
                 
    const waUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
    
    setSubmitted(true);
    setTimeout(() => {
      window.open(waUrl, '_blank');
      setSubmitted(false);
      setFormData({ fullName: '', phone: '', inquiryType: 'استفسار عن سعر صنف وتوافره', message: '' });
    }, 1200);
  };

  return (
    <div className="contact-page-wrapper pb-5">
      {/* 1. Unified Split Luxury Hero Banner */}
      <section className="py-3 py-md-4 mb-4">
        <Container>
          <div className="split-luxury-hero">
            <Row className="g-0 align-items-center">
              {/* Right Column (Text & Trust Row) */}
              <Col lg={7} className="order-2 order-lg-1">
                <div className="split-hero-content text-center text-lg-end">
                  <div className="split-hero-badge mx-auto mx-lg-0">
                    <Sparkles size={14} className="text-warning-dark" />
                    <span>خدمة العملاء والاستشارات - معرض السيد الجزار</span>
                  </div>

                  <h1 className="split-hero-title">
                    تواصل معنا <span className="text-gold">وعناوين الفروع</span> واستشارات التشطيب
                  </h1>

                  <p className="split-hero-subtitle">
                    يسعدنا تشريفكم لنا في فروعنا بمدينة بنها، أو تقديم الاستشارات الفورية وحساب كميات السيراميك والبورسلين عبر الواتساب والاتصال الهاتفي المباشر.
                  </p>

                  <div className="split-hero-trust-row justify-content-center justify-content-lg-start">
                    <span className="split-hero-trust-item">
                      <CheckCircle2 size={16} /> رد فوري عبر الواتساب
                    </span>
                    <span className="split-hero-trust-item">
                      <CheckCircle2 size={16} /> فروع مركزية بمدينة بنها
                    </span>
                    <span className="split-hero-trust-item">
                      <CheckCircle2 size={16} /> استشارات فنية ومعاينة مجانية
                    </span>
                  </div>

                  <div className="d-flex flex-wrap gap-2.5 justify-content-center justify-content-lg-start mt-4">
                    <a 
                      href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن عروض وتصاميم المعرض')}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn-hero-gold text-decoration-none"
                    >
                      <MessageCircle size={18} />
                      تحدث مع المبيعات واتساب
                    </a>

                    <a 
                      href={`tel:${phoneNumber}`}
                      className="btn-hero-light text-decoration-none"
                    >
                      <PhoneCall size={18} className="text-success" />
                      اتصال هاتفي مباشر ({phoneNumber})
                    </a>
                  </div>
                </div>
              </Col>

              {/* Left Column (Luxury Showroom Image) */}
              <Col lg={5} className="order-1 order-lg-2">
                <div className="split-hero-img-wrap">
                  <img 
                    src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=85" 
                    alt="معرض السيد الجزار للسيراميك والبورسلين"
                    className="split-hero-img"
                    loading="eager"
                  />
                  <div className="split-hero-img-badge">
                    <MapPin size={13} className="text-warning" /> بنها - القليوبية
                  </div>
                </div>
              </Col>
            </Row>
          </div>
        </Container>
      </section>

      {/* 2. Main Content Grid: Direct Channels & Interactive Form */}
      <Container className="mb-5">
        <Row className="g-4 align-items-stretch">
          
          {/* Right Column: Channels & Branches */}
          <Col lg={6}>
            <div className="h-100 d-flex flex-column gap-4">
              
              {/* Quick Communication Box */}
              <div className="p-4 rounded-4 bg-white border shadow-sm">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                  <span className="p-2 rounded-3 bg-warning-subtle text-warning-emphasis">
                    <PhoneCall size={20} />
                  </span>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">قنوات الاتصال المباشرة</h5>
                    <small className="text-muted">فريق المبيعات متاح يومياً لمساعدتك</small>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {/* Hotline */}
                  <a 
                    href={`tel:${phoneNumber}`}
                    className="d-flex align-items-center justify-content-between p-3 rounded-3 text-decoration-none border transition-all"
                    style={{ backgroundColor: '#f8fafc', borderColor: '#e2e8f0' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2.5 rounded-circle bg-primary bg-opacity-10 text-primary">
                        <Phone size={20} />
                      </div>
                      <div>
                        <div className="small text-muted fw-bold">الخط الساخن والمبيعات</div>
                        <div className="fw-bold text-dark fs-5">{phoneNumber}</div>
                      </div>
                    </div>
                    <span className="btn btn-sm btn-outline-primary rounded-pill px-3 fw-bold">اتصال الآن</span>
                  </a>

                  {/* WhatsApp */}
                  <a 
                    href={`https://wa.me/${whatsappNumber}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="d-flex align-items-center justify-content-between p-3 rounded-3 text-decoration-none border transition-all"
                    style={{ backgroundColor: '#f0fdf4', borderColor: '#bbf7d0' }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div className="p-2.5 rounded-circle bg-success bg-opacity-10 text-success">
                        <MessageSquare size={20} />
                      </div>
                      <div>
                        <div className="small text-success fw-bold">المراسلة الفورية عبر واتساب</div>
                        <div className="fw-bold text-dark fs-5">{whatsappNumber}</div>
                      </div>
                    </div>
                    <span className="btn btn-sm btn-success rounded-pill px-3 fw-bold">محادثة فورية</span>
                  </a>
                </div>
              </div>

              {/* Branches & Showrooms */}
              <div className="p-4 rounded-4 bg-white border shadow-sm flex-grow-1">
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                  <span className="p-2 rounded-3 bg-warning-subtle text-warning-emphasis">
                    <MapPin size={20} />
                  </span>
                  <div>
                    <h5 className="fw-bold mb-0 text-dark">فروع ومواقع المعرض</h5>
                    <small className="text-muted">اختر الفرع لعرض موقعه المباشر على الخريطة</small>
                  </div>
                </div>

                <div className="d-flex flex-column gap-3">
                  {branches.map((branch, idx) => {
                    const isSelected = selectedBranchIdx === idx;
                    const cleanAddress = branch.replace(/^فرع \d+:\s*/i, '').trim();
                    return (
                      <div 
                        key={idx}
                        onClick={() => setSelectedBranchIdx(idx)}
                        className={`p-3 rounded-3 border cursor-pointer transition-all ${
                          isSelected ? 'border-warning shadow-sm' : 'border-light-subtle'
                        }`}
                        style={{
                          backgroundColor: isSelected ? '#fffdf5' : '#ffffff',
                          borderColor: isSelected ? 'var(--primary-gold)' : '#e2e8f0',
                          cursor: 'pointer'
                        }}
                      >
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <div className="d-flex align-items-center gap-2">
                            <span className={`badge ${isSelected ? 'bg-warning text-dark' : 'bg-secondary-subtle text-secondary'} rounded-pill`}>
                              الفرع {idx + 1}
                            </span>
                            <span className="fw-bold text-dark">
                              {idx === 0 ? 'فرع مدخل بنها القبلي (برج العطار)' : 'فرع كوبري الشموت (برج السنهوي)'}
                            </span>
                          </div>
                          {isSelected && (
                            <span className="small text-warning-emphasis fw-bold">🗺️ معروض بالأسفل</span>
                          )}
                        </div>

                        <p className="small text-muted mb-2 ps-1">
                          📍 {cleanAddress}
                        </p>

                        <div className="d-flex justify-content-between align-items-center pt-2 border-top border-light-subtle">
                          <span className="small text-muted d-flex align-items-center gap-1">
                            <Clock size={13} className="text-warning-dark" />
                            مواعيد العمل: {settings?.workingHours || '10:00 ص - 11:30 م'}
                          </span>

                          {mapUrls[idx] && (
                            <a 
                              href={mapUrls[idx]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="btn btn-sm btn-outline-warning text-dark fw-bold rounded-pill px-3"
                              onClick={(e) => e.stopPropagation()}
                            >
                              <Compass size={13} className="me-1" />
                              الاتجاهات
                            </a>
                          )}
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>
          </Col>

          {/* Left Column: Interactive Form */}
          <Col lg={6}>
            <div className="p-4 p-md-5 rounded-4 bg-white border shadow-sm h-100 d-flex flex-column justify-content-between">
              <div>
                <div className="d-flex align-items-center gap-2 mb-3 pb-2 border-bottom">
                  <span className="p-2 rounded-3 bg-warning-subtle text-warning-emphasis">
                    <Send size={20} />
                  </span>
                  <div>
                    <h4 className="fw-bold mb-0 text-dark">طلب استفسار أو عرض أسعار فوري</h4>
                    <small className="text-muted">املأ بياناتك وسيتم توجيه طلبك فوراً لمبيعات الواتساب</small>
                  </div>
                </div>

                {submitted ? (
                  <div className="text-center py-5">
                    <CheckCircle2 size={60} className="text-success mb-3 animate-bounce" />
                    <h4 className="fw-bold text-dark mb-2">تم تجهيز طلبك بنجاح!</h4>
                    <p className="text-muted">جاري فتح تطبيق الواتساب لمراسلة فريق المبيعات مباشرة...</p>
                  </div>
                ) : (
                  <Form onSubmit={handleSubmit} className="d-flex flex-column gap-3 mt-4">
                    {/* Name */}
                    <Form.Group controlId="fullName">
                      <Form.Label className="fw-bold text-dark small mb-1">الاسم الكريم *</Form.Label>
                      <Form.Control 
                        type="text" 
                        placeholder="أدخل اسمك الكريم..." 
                        value={formData.fullName}
                        onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                        required
                        className="py-2.5 px-3 rounded-3 border-secondary-subtle"
                      />
                    </Form.Group>

                    {/* Phone */}
                    <Form.Group controlId="phone">
                      <Form.Label className="fw-bold text-dark small mb-1">رقم الهاتف أو الواتساب *</Form.Label>
                      <Form.Control 
                        type="tel" 
                        placeholder="أدخل رقم الموبايل للتواصل..." 
                        value={formData.phone}
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                        required
                        className="py-2.5 px-3 rounded-3 border-secondary-subtle"
                      />
                    </Form.Group>

                    {/* Inquiry Type */}
                    <Form.Group controlId="inquiryType">
                      <Form.Label className="fw-bold text-dark small mb-1">نوع الطلب أو الاستفسار</Form.Label>
                      <Form.Select 
                        value={formData.inquiryType}
                        onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                        className="py-2.5 px-3 rounded-3 border-secondary-subtle"
                      >
                        <option value="استفسار عن أسعار وتوافر أصناف">استفسار عن أسعار وتوافر موديلات معينة</option>
                        <option value="طلب مقايسة وعرض سعر كمية (شقة / فيلا)">طلب مقايسة وعرض سعر لكمية شقة أو فيلا</option>
                        <option value="حجز موعد زيارة ومعاينة بالمعرض">حجز موعد زيارة ومعاينة داخل المعرض</option>
                        <option value="استفسارات أخرى">استفسارات وملاحظات أخرى</option>
                      </Form.Select>
                    </Form.Group>

                    {/* Details */}
                    <Form.Group controlId="message">
                      <Form.Label className="fw-bold text-dark small mb-1">تفاصيل طلبك أو كود الموديل</Form.Label>
                      <Form.Control 
                        as="textarea" 
                        rows={3} 
                        placeholder="اكتب هنا تفاصيل طلبك (المساحة، الموديل المطلوب، أو أي تفاصيل أخرى)..." 
                        value={formData.message}
                        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                        className="py-2.5 px-3 rounded-3 border-secondary-subtle"
                      />
                    </Form.Group>

                    {/* Submit */}
                    <Button 
                      type="submit" 
                      className="btn-hero-gold w-100 py-3 mt-2 fw-bold d-flex align-items-center justify-content-center gap-2"
                    >
                      <Send size={18} />
                      إرسال الاستفسار الآن عبر واتساب
                    </Button>
                  </Form>
                )}
              </div>

              <div className="mt-4 pt-3 border-top text-center text-muted small">
                🛡️ بياناتك في أمان تام ويتم استخدامها للتواصل معك بخصوص طلبك فقط.
              </div>
            </div>
          </Col>

        </Row>

        {/* 3. Interactive Embedded Map */}
        {branches.length > 0 && (
          <div className="mt-5 p-4 rounded-4 bg-white border shadow-sm">
            <div className="d-flex flex-wrap justify-content-between align-items-center mb-3 gap-2">
              <div>
                <h5 className="fw-bold text-dark mb-0">
                  🗺️ الخريطة التفاعلية: {selectedBranchIdx === 0 ? 'الفرع الأول (برج العطار)' : 'الفرع الثاني (برج السنهوي)'}
                </h5>
                <small className="text-muted">اضغط على الخريطة للتحريك أو احصل على الاتجاهات الدقيقة عبر GPS</small>
              </div>

              {mapUrls[selectedBranchIdx] && (
                <a 
                  href={mapUrls[selectedBranchIdx]} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="btn btn-outline-warning text-dark fw-bold rounded-pill px-4 py-2"
                >
                  <Compass size={16} className="me-1" />
                  فتح في تطبيق خرائط Google
                </a>
              )}
            </div>

            <div className="position-relative overflow-hidden rounded-4 border shadow-inner" style={{ height: '380px', backgroundColor: '#f1f5f9' }}>
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
          </div>
        )}
      </Container>
    </div>
  );
};

export default Contact;

