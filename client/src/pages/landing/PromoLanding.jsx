import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { MessageSquare, Phone, MapPin, Award, CheckCircle2, ChevronLeft, Sparkles, Send } from 'lucide-react';
import './PromoLanding.css';

const PromoLanding = ({ settings, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    interestedIn: 'سيراميك أرضيات'
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    // Direct WhatsApp message formatting for high conversion
    const message = `السلام عليكم ورحمة الله وبركاته،\nأنا مهتم بعروض السيراميك والبورسلين.\n\n*الاسم:* ${formData.name}\n*الهاتف:* ${formData.phone}\n*القسم المهتم به:* ${formData.interestedIn}\n*ملاحظات:* ${formData.notes || 'لا يوجد'}`;
    const encodedText = encodeURIComponent(message);
    const whatsappNum = settings?.whatsappNumber || '201001366499';
    
    // Open whatsapp link
    window.open(`https://wa.me/${whatsappNum}?text=${encodedText}`, '_blank');
    setSuccess(true);
  };

  const handleQuickCall = () => {
    const phoneNum = settings?.phoneNumber || '01001366499';
    window.open(`tel:${phoneNum}`, '_self');
  };

  const showcaseCategories = [
    {
      title: 'سيراميك أرضيات فاخر',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'بورسلين مستورد ومحلي',
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'حوائط ومطابخ حديثة',
      img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=400&q=80'
    },
    {
      title: 'خلاطات وأطقم حمام',
      img: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=400&q=80'
    }
  ];

  return (
    <div className="promo-landing-wrapper">
      {/* Hero Banner */}
      <section className="promo-hero-section">
        <Container>
          <div className="promo-hero-tag animate-bounce">
            <Sparkles size={16} className="d-inline-block me-1 text-warning" />
            عروض حصرية لفترة محدودة جداً!
          </div>
          <h1 className="promo-hero-title">
            فخامة السيراميك والبورسلين <br />
            تبدأ من <span>{settings?.showroomName || 'معرض السيد الجزار'}</span>
          </h1>
          <p className="promo-hero-desc">
            اكتشف تشكيلة راقية من أرقى الديكورات وأحدث الموديلات لعام 2026. وفرنا لك أفضل الأسعار والخصومات الحصرية مع إمكانية التوصيل والتركيب.
          </p>

          <div className="promo-cta-buttons">
            <button className="btn btn-promo-primary d-flex align-items-center gap-2" onClick={handleSubmit}>
              <MessageSquare size={20} />
              <span>احصل على الخصم الفوري عبر واتساب</span>
            </button>
            <button className="btn btn-promo-secondary d-flex align-items-center gap-2" onClick={() => onNavigate('catalog')}>
              <span>تصفح الكتالوج الكامل</span>
              <ChevronLeft size={18} />
            </button>
          </div>
        </Container>
      </section>

      {/* Highlights & Promo Section */}
      <section className="promo-offers-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <div className="promo-offer-card text-center shadow-lg">
                <div className="promo-badge-corner">تخفيض كبير</div>
                <Award size={48} className="text-warning mb-3" />
                <h3 className="fw-black mb-3 text-warning">عروض موسم التشطيبات الحالية</h3>
                <p className="fs-5 mb-4">
                  {settings?.announcement || 'خصم فوري يصل إلى 20% على تشكيلة مميزة من البورسلين المستورد 60x120 وسيراميك كليوباترا الأصلي!'}
                </p>
                <div className="d-flex justify-content-center gap-4 flex-wrap">
                  <div className="d-flex align-items-center gap-2 fw-bold text-success fs-6">
                    <CheckCircle2 size={20} />
                    <span>ضمان الجودة 100%</span>
                  </div>
                  <div className="d-flex align-items-center gap-2 fw-bold text-success fs-6">
                    <CheckCircle2 size={20} />
                    <span>متاح التوصيل لباب موقعك</span>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Visual Circle Category Showcase */}
      <section className="promo-showcase-section">
        <Container>
          <h2 className="promo-showcase-title text-warning">أقوى تشكيلات السيراميك والبورسلين</h2>
          <Row className="mt-5 justify-content-center">
            {showcaseCategories.map((item, idx) => (
              <Col lg={3} md={6} xs={6} key={idx}>
                <div className="promo-category-item" onClick={() => onNavigate('catalog')}>
                  <div className="promo-category-img-wrapper">
                    <img src={item.img} alt={item.title} />
                  </div>
                  <h5 className="promo-category-title mt-3">{item.title}</h5>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Quick Contact Form (WhatsApp High-Conversion Form) */}
      <section className="promo-inquiry-section">
        <Container>
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <h2 className="fw-black mb-3">هل تشطب شقتك أو فيلتك حالياً؟</h2>
              <p className="fs-5 opacity-90 leading-relaxed mb-4">
                دعنا نساعدك في حساب الكميات المطلوبة واختيار أفضل الأنواع التي تناسب ميزانيتك. املأ بياناتك فوراً وسيقوم أحد مسؤولي المبيعات بالرد عليك بتقرير عرض سعر تفصيلي مجاناً!
              </p>
              <div className="d-flex flex-column gap-3">
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2.5 bg-warning text-dark rounded-3">
                    <Phone size={20} />
                  </div>
                  <div>
                    <span className="d-block small text-light opacity-75">اتصال مباشر فوراً</span>
                    <a href={`tel:${settings?.phoneNumber || '01001366499'}`} className="fw-black fs-5 text-warning text-decoration-none">
                      {settings?.phoneNumber || '01001366499'}
                    </a>
                  </div>
                </div>
                <div className="d-flex align-items-center gap-3">
                  <div className="p-2.5 bg-warning text-dark rounded-3">
                    <MapPin size={20} />
                  </div>
                  <div>
                    <span className="d-block small text-light opacity-75">موقع المعرض</span>
                    <span className="fw-bold text-white">البحث في خرائط جوجل للتوجيه</span>
                  </div>
                </div>
              </div>
            </Col>

            <Col lg={6}>
              <div className="promo-inquiry-card">
                <h4 className="fw-bold mb-4 text-warning">طلب عرض سعر مخصص</h4>
                {success && (
                  <Alert variant="success" className="rounded-3">
                    تم تحضير بياناتك وفتح المحادثة على واتساب بنجاح!
                  </Alert>
                )}
                <Form onSubmit={handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">الاسم الكريم</Form.Label>
                    <Form.Control
                      type="text"
                      required
                      placeholder="اكتب اسمك هنا..."
                      className="promo-input-custom"
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">رقم الهاتف (واتساب)</Form.Label>
                    <Form.Control
                      type="tel"
                      required
                      placeholder="رقم الواتساب الخاص بك..."
                      className="promo-input-custom"
                      value={formData.phone}
                      onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    />
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-bold">القسم المستهدف للتشطيب</Form.Label>
                    <Form.Select
                      className="promo-input-custom text-white"
                      style={{ background: 'rgba(255, 255, 255, 0.05)' }}
                      value={formData.interestedIn}
                      onChange={(e) => setFormData({...formData, interestedIn: e.target.value})}
                    >
                      <option value="سيراميك أرضيات">سيراميك أرضيات</option>
                      <option value="بورسلين مستورد">بورسلين مستورد</option>
                      <option value="سيراميك حوائط حمامات ومطابخ">سيراميك حوائط حمامات ومطابخ</option>
                      <option value="أطقم حمامات وصحي">أطقم حمامات وصحي</option>
                    </Form.Select>
                  </Form.Group>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">ملاحظات أو أسئلة إضافية</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="مثال: مساحة الشقة 120 متر، أريد بورسلين نخب أول..."
                      className="promo-input-custom"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn btn-promo-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Send size={18} />
                    <span>إرسال الطلب والاستعلام فوراً</span>
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default PromoLanding;
