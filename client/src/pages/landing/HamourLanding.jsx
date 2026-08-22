import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { MessageSquare, Phone, MapPin, Sparkles, Send, Anchor, Compass } from 'lucide-react';
import './HamourLanding.css';

const HamourLanding = ({ settings, onNavigate }) => {
  const [formData, setFormData] = useState({
    name: '',
    phone: '',
    notes: '',
    interestedIn: 'سيراميك الأنّاناسة الإسفنجي 🍍',
    location: 'حي دير السلطعون'
  });
  const [success, setSuccess] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.phone.trim()) return;

    // Creative Bikini Bottom WhatsApp message format
    const message = `🌊🐚 أهلاً بك في قاع الهامور! 🌊\n\nأنا مواطن من قاع الهامور وأريد تشطيب منزلي بسيراميك الجزار المقاوم لملوحة مياه المحيط.\n\n*الاسم:* ${formData.name}\n*الهاتف:* ${formData.phone}\n*محل الإقامة:* ${formData.location}\n*القسم المطلوب للتشطيب:* ${formData.interestedIn}\n*ملاحظات إضافية:* ${formData.notes || 'لا يوجد'}`;
    const encodedText = encodeURIComponent(message);
    const whatsappNum = settings?.whatsappNumber || '201001366499';
    
    window.open(`https://wa.me/${whatsappNum}?text=${encodedText}`, '_blank');
    setSuccess(true);
  };

  const hamourProducts = [
    {
      title: 'سيراميك الأنّاناسة الإسفنجي 🍍',
      desc: 'بلاطات مبهجة مريحة ومقاومة لرطوبة مياه المحيط، مخصصة لعشاق البهجة والألوان الفاتحة الزاهية (تشطيب بيت سبونج بوب!).',
      price: '45 شل هاموري / م2',
      img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=300&q=80'
    },
    {
      title: 'بلاط دير السلطعون الذهبي 💰',
      desc: 'بورسلين ذهبي فاخر عالي اللمعان ومقاوم للخدش، مخصص لعشاق جمع القرش والفخامة الراقية (مستوحى من تصميم قصر مستر سلطع).',
      price: '95 شل هاموري / م2',
      img: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=300&q=80'
    },
    {
      title: 'سيراميك الحبار الكلاسيكي الكئيب 🦑',
      desc: 'درجات رمادية وبيج هادئة جداً كلاسيكية وراقية، مخصصة لعشاق الهدوء والعزف على الكلارينيت بدون إزعاج الجيران (بيت شفيق).',
      price: '60 شل هاموري / م2',
      img: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=300&q=80'
    },
    {
      title: 'بلاط صخرة بسيط المتين 🪨',
      desc: 'سيراميك خشن غير قابل للانزلاق، صلب ومقاوم للصدمات والخدوش، عملي واقتصادي جداً يناسب الاستعمال الشاق والبيوت العملية.',
      price: '30 شل هاموري / م2',
      img: 'https://images.unsplash.com/photo-1507652313519-d4e9174996dd?auto=format&fit=crop&w=300&q=80'
    }
  ];

  // Generate 12 interactive bubbles with random positions and animation delays
  const bubbles = Array.from({ length: 12 }, (_, i) => {
    const size = Math.floor(Math.random() * 45) + 15;
    const left = Math.floor(Math.random() * 95);
    const delay = Math.random() * 8;
    const duration = Math.floor(Math.random() * 6) + 8;
    return (
      <div 
        key={i} 
        className="bubble" 
        style={{
          width: `${size}px`,
          height: `${size}px`,
          left: `${left}%`,
          animationDelay: `${delay}s`,
          animationDuration: `${duration}s`
        }}
      />
    );
  });

  return (
    <div className="hamour-wrapper">
      {/* Floating Bubbles */}
      <div className="bubbles-container">{bubbles}</div>

      {/* Hero Banner */}
      <section className="hamour-hero">
        <Container>
          <div className="hamour-badge-promo">
            <Anchor size={18} />
            <span>حصرياً لأهالي قاع الهامور!</span>
          </div>
          <h1 className="hamour-title">معرض السيد الجزار للسيراميك والبورسلين</h1>
          <p className="hamour-subtitle">أقوى تشكيلات التشطيب المقاومة لملوحة البحر وضغط المحيط 🌊🍍</p>
          <p className="lead max-w-2xl mx-auto mb-4 opacity-90 fs-5 text-warning fw-bold">
            "شطب بيتك البطيخي أو الصخري بأقل الأسعار في السوق!"
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
            <button className="btn btn-hamour-primary d-flex align-items-center gap-2" onClick={handleSubmit}>
              <MessageSquare size={20} />
              <span>تواصل مع ساندي لطلب خصم فوري 🐿️</span>
            </button>
            <button className="btn btn-hamour-secondary d-flex align-items-center gap-2" onClick={() => onNavigate('catalog')}>
              <Compass size={18} />
              <span>الذهاب للمعرض البشري الرئيسي</span>
            </button>
          </div>
        </Container>
      </section>

      {/* Funny Product Cards */}
      <section className="py-5">
        <Container>
          <h2 className="text-center fw-black mb-5 text-warning">أقوى الموديلات المعتمدة من أهالي القاع</h2>
          <Row className="g-4">
            {hamourProducts.map((prod, idx) => (
              <Col lg={3} md={6} key={idx}>
                <div className="hamour-card">
                  <div className="porthole-frame">
                    <img src={prod.img} alt={prod.title} />
                  </div>
                  <h4 className="hamour-card-title">{prod.title}</h4>
                  <p className="hamour-card-desc">{prod.desc}</p>
                  <div className="hamour-card-price">{prod.price}</div>
                </div>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Bikini Bottom Inquiry Form */}
      <section className="hamour-form-section">
        <Container>
          <Row className="justify-content-center">
            <Col lg={8} md={10}>
              <div className="hamour-form-card">
                <div className="text-center mb-4">
                  <Sparkles size={40} className="text-warning mb-2" />
                  <h3 className="fw-black text-warning">طلب مقايسة قاع الهامور المجانية 🐚</h3>
                  <p className="opacity-75">املأ طلبك وسيقوم سريعاً أحد مسؤولي المبيعات بالتواصل معك فوراً</p>
                </div>

                {success && (
                  <Alert variant="success" className="rounded-3 text-dark fw-bold">
                    تم تجهيز بياناتك! جاري فتح الواتساب للتواصل مع وكلاء قاع الهامور 📲
                  </Alert>
                )}

                <Form onSubmit={handleSubmit}>
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">الاسم الكريم (المواطن الهاموري)</Form.Label>
                        <Form.Control
                          type="text"
                          required
                          placeholder="اكتب اسمك الكريم..."
                          className="hamour-input"
                          value={formData.name}
                          onChange={(e) => setFormData({...formData, name: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">رقم الهاتف (الواتساب)</Form.Label>
                        <Form.Control
                          type="tel"
                          required
                          placeholder="رقم هاتفك للتواصل..."
                          className="hamour-input"
                          value={formData.phone}
                          onChange={(e) => setFormData({...formData, phone: e.target.value})}
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">موقع عقارك للتسليم</Form.Label>
                        <Form.Select
                          className="hamour-input text-white"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
                          style={{ background: 'rgba(7, 89, 133, 0.4)' }}
                        >
                          <option value="حي دير السلطعون">حي دير السلطعون 🦀</option>
                          <option value="بجوار منزل الأنّاناسة">بجوار منزل الأنّاناسة 🍍</option>
                          <option value="منطقة صخرة بسيط">منطقة صخرة بسيط 🪨</option>
                          <option value="حي الخور الهادئ">حي الخور الهادئ 🦑</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-bold">المنتج المراد الاستفسار عنه</Form.Label>
                        <Form.Select
                          className="hamour-input text-white"
                          value={formData.interestedIn}
                          onChange={(e) => setFormData({...formData, interestedIn: e.target.value})}
                          style={{ background: 'rgba(7, 89, 133, 0.4)' }}
                        >
                          <option value="سيراميك الأنّاناسة الإسفنجي 🍍">سيراميك الأنّاناسة الإسفنجي 🍍</option>
                          <option value="بلاط دير السلطعون الذهبي 💰">بلاط دير السلطعون الذهبي 💰</option>
                          <option value="سيراميك الحبار الكلاسيكي 🦑">سيراميك الحبار الكلاسيكي 🦑</option>
                          <option value="بلاط صخرة بسيط المتين 🪨">بلاط صخرة بسيط المتين 🪨</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Label className="fw-bold">تفاصيل أو ملاحظات مقاس الشقة</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="مثال: أريد شحن 150 متر لحي دير السلطعون، مع خلاطات مياه غير قابلة للصدأ..."
                      className="hamour-input"
                      value={formData.notes}
                      onChange={(e) => setFormData({...formData, notes: e.target.value})}
                    />
                  </Form.Group>

                  <Button
                    type="submit"
                    className="btn btn-hamour-primary w-100 py-3 d-flex align-items-center justify-content-center gap-2"
                  >
                    <Send size={18} />
                    <span>إرسال مقايستك لمكتب ساندي أمور 🐚🚀</span>
                  </Button>
                </Form>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Footer Info */}
      <footer className="py-4 text-center border-top border-warning border-opacity-25" style={{ background: 'rgba(15,23,42,0.4)' }}>
        <Container>
          <p className="mb-0 small opacity-75">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - فرع قاع الهامور الترويجي التابع لمعرض السيد الجزار للسيراميك والبورسلين 🏛️
          </p>
        </Container>
      </footer>
    </div>
  );
};

export default HamourLanding;
