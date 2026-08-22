import React, { useState } from 'react';
import { Container, Row, Col, Form, Button, Alert } from 'react-bootstrap';
import { MessageSquare, Compass, Send, Sparkles, Anchor, MapPin, Award } from 'lucide-react';
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

    // Direct WhatsApp message formatting for high conversion
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

  const SeaweedSVG = () => (
    <svg width="120" height="350" viewBox="0 0 120 350" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path className="seaweed-stem" d="M30 350C30 300 10 250 20 200C30 150 70 120 50 70C30 20 60 0 60 0C60 0 80 30 70 80C60 130 90 160 80 210C70 260 90 300 90 350H30Z" fill="#14532d" opacity="0.8"/>
      <path className="seaweed-stem" d="M10 350C20 310 30 280 25 240C20 200 45 170 35 130C25 90 50 50 45 10C45 10 55 35 48 80C41 125 60 150 52 190C44 230 55 270 50 350H10Z" fill="#166534" opacity="0.6"/>
      <path className="seaweed-stem" d="M60 350C70 320 85 290 80 260C75 230 95 200 88 170C81 140 100 110 95 70C95 70 105 90 98 130C91 170 108 190 101 220C94 250 105 285 100 350H60Z" fill="#15803d" opacity="0.5"/>
    </svg>
  );

  const WaveDivider = () => (
    <div className="wave-divider">
      <svg className="wave-svg" viewBox="0 0 1440 74" preserveAspectRatio="none" xmlns="http://www.w3.org/2000/svg">
        <path d="M0,32L120,42.7C240,53,480,75,720,74.7C960,75,1200,53,1320,42.7L1440,32L1440,74L1320,74C1200,74,960,74,720,74C480,74,240,74,120,74L0,74Z" />
      </svg>
    </div>
  );

  const bubbles = Array.from({ length: 15 }, (_, i) => {
    const size = Math.floor(Math.random() * 35) + 12;
    const left = Math.floor(Math.random() * 95);
    const delay = Math.random() * 10;
    const duration = Math.floor(Math.random() * 5) + 7;
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
    <div className="hamour-wrapper pb-5">
      {/* Light Rays & Bubbles */}
      <div className="underwater-rays"></div>
      <div className="bubbles-container">{bubbles}</div>

      {/* Floating Jellyfish Glow */}
      <div className="jellyfish-glow" style={{ top: '20%', left: '10%' }}></div>
      <div className="jellyfish-glow" style={{ top: '55%', right: '12%', animationDelay: '3s' }}></div>

      {/* Swaying Seaweeds in corners */}
      <div className="seaweed-container seaweed-left"><SeaweedSVG /></div>
      <div className="seaweed-container seaweed-right"><SeaweedSVG /></div>

      {/* Hero Header Plaque */}
      <section className="hamour-hero">
        <Container>
          <div className="nautical-plaque mb-4">
            <div className="hamour-badge-promo mb-3">
              <Anchor size={18} className="animate-spin" />
              <span>خبر عاجل في قاع الهامور 📢</span>
            </div>
            <h1 className="hamour-title cartoon-stroke mb-1">تم افتتاح فرع السيراميك الأول تحت الماء!</h1>
            <p className="hamour-subtitle cartoon-stroke-sub mb-0">بالتعاون مع معرض السيد الجزار لتوفير بورسلين مقاوم للضغط والملوحة 🏛️🌊</p>
          </div>
          
          <p className="lead max-w-2xl mx-auto mb-4 opacity-90 fs-5 text-warning fw-black">
             "الفرع الجديد يقع رسمياً بجوار منزل الأنّاناسة وبين بيت بسيط وشفيق!"
          </p>

          <div className="d-flex justify-content-center gap-3 flex-wrap mt-4">
            <button className="btn btn-hamour-primary d-flex align-items-center gap-2" onClick={handleSubmit}>
              <MessageSquare size={20} />
              <span>احجز معاينتك مع ساندي أمور عبر واتساب 🐿️</span>
            </button>
            <button className="btn btn-hamour-secondary d-flex align-items-center gap-2" onClick={() => onNavigate('catalog')}>
              <Compass size={18} />
              <span>الذهاب للمعرض البشري الرئيسي 🏛️</span>
            </button>
          </div>
        </Container>
      </section>

      <WaveDivider />

      {/* Immersive Story Visual Showcase */}
      <section className="py-5" style={{ position: 'relative', zIndex: 3 }}>
        <Container>
          {/* Item 1: SpongeBob's Pineapple House with Marble Pathway */}
          <Row className="align-items-center mb-5 g-5">
            <Col lg={6}>
              <div className="hamour-glass-card spongebob-theme p-2">
                <img 
                  src="/spongebob_pineapple_marble.jpg" 
                  alt="SpongeBob Pineapple Marble Pathway" 
                  className="img-fluid rounded-4 shadow-lg border border-warning"
                  style={{ borderWidth: '3px' }}
                />
              </div>
            </Col>
            <Col lg={6}>
              <h2 className="fw-black cartoon-stroke mb-3">
                <Sparkles className="d-inline-block me-2" />
                مدخل بيت سبونج بوب الجديد!
              </h2>
              <p className="fs-5 leading-relaxed text-light">
                سبونج بوب قرر يغير واجهة بيته البطيخي! شطبنا الممشى الرئيسي بالكامل باستخدام **أرقى أنواع البورسلين الأبيض المعرق بالذهب** ليليق باستقبال الأصدقاء. 
              </p>
              <ul className="list-unstyled mt-3 fs-6 text-warning fw-bold">
                <li>✔️ مقاوم للرطوبة وتراكم الطحالب البحرية.</li>
                <li>✔️ يمنح لمعاناً فريداً تحت أشعة الشمس الذهبية.</li>
                <li>✔️ مضاد للانزلاق ومناسب لخطوات سريع البطيئة.</li>
              </ul>
            </Col>
          </Row>

          <WaveDivider />

          {/* Item 2: Krusty Krab with Luxury Ceramic Floor */}
          <Row className="align-items-center mb-5 g-5 flex-lg-row-reverse">
            <Col lg={6}>
              <div className="hamour-glass-card mrkrabs-theme p-2">
                <img 
                  src="/krusty_krab_luxury_tiles.jpg" 
                  alt="Krusty Krab Luxury Gold Tiles" 
                  className="img-fluid rounded-4 shadow-lg border border-warning"
                  style={{ borderWidth: '3px' }}
                />
              </div>
            </Col>
            <Col lg={6}>
              <h2 className="fw-black cartoon-stroke mb-3">
                <Award className="d-inline-block me-2" />
                مطعم سلطع برجر بالبلاط الملكي!
              </h2>
              <p className="fs-5 leading-relaxed text-light">
                مستر سلطع وافق أخيراً على صرف بعض الأموال لتجديد مطعمه! اخترنا له **سيراميك ملكي بنقوش زرقاء ملكية وإطارات ذهبية فاخرة** لتجذب زبائن قاع الهامور وتزيد من الأرباح.
              </p>
              <ul className="list-unstyled mt-3 fs-6 text-warning fw-bold">
                <li>✔️ يتحمل الاستخدام الشاق والضغط اليومي للزبائن.</li>
                <li>✔️ يعطي طابعاً ملوكياً يبرز حب مستر سلطع للذهب.</li>
                <li>✔️ سهل التنظيف ومقاوم للصدأ وتراكم المياه.</li>
              </ul>
            </Col>
          </Row>

          <WaveDivider />

          {/* Item 3: Squidward's Easter Island Head with Grey Marble */}
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="hamour-glass-card squidward-theme p-2">
                <img 
                  src="/squidward_house_grey_tiles.jpg" 
                  alt="Squidward Easter Island Marble" 
                  className="img-fluid rounded-4 shadow-lg border border-warning"
                  style={{ borderWidth: '3px' }}
                />
              </div>
            </Col>
            <Col lg={6}>
              <h2 className="fw-black cartoon-stroke mb-3">
                <MapPin className="d-inline-block me-2" />
                صومعة شفيق الكلاسيكية الفخمة!
              </h2>
              <p className="fs-5 leading-relaxed text-light">
                شفيق حبار طلب واجهة كلاسيكية فاخرة تناسب ذوقه الموسيقي الرفيع. قمنا بكساء واجهة منزله الصخري بـ **الرخام الرمادي الطبيعي الفاخر** ليعزل الصوت ويوفر الهدوء أثناء عزف الكلارينيت.
              </p>
              <ul className="list-unstyled mt-3 fs-6 text-warning fw-bold">
                <li>✔️ عازل طبيعي ومقاوم لعوامل التعرية والضغط.</li>
                <li>✔️ تصميم كلاسيكي راقٍ وخالٍ من أي بهرجة مزعجة.</li>
                <li>✔️ يعبر عن شخصية شفيق الأنيقة والهادئة.</li>
              </ul>
            </Col>
          </Row>
        </Container>
      </section>

      <WaveDivider />

      {/* Bikini Bottom Products Grid */}
      <section className="py-5" style={{ position: 'relative', zIndex: 3 }}>
        <Container>
          <div className="nautical-plaque d-block mx-auto text-center mb-5" style={{ maxWidth: '400px' }}>
            <h3 className="fw-black cartoon-stroke mb-0">أصناف فرع قاع الهامور 🐚</h3>
          </div>
          
          <Row className="g-4">
            {hamourProducts.map((prod, idx) => (
              <Col lg={3} md={6} key={idx}>
                <div className="hamour-glass-card">
                  <div className="porthole-window">
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
                  <Anchor size={40} className="text-warning mb-2 animate-bounce" />
                  <h3 className="fw-black cartoon-stroke mb-2">طلب معاينة ومقايسة من ساندي 🐿️</h3>
                  <p className="opacity-75">املأ بياناتك وسيتم توجيه مندوبنا في قاع الهامور لتحديد الشحن المناسب</p>
                </div>

                {success && (
                  <Alert variant="success" className="rounded-4 text-dark fw-bold">
                    تمت المقايسة بنجاح! جاري تحويلك لواتساب ساندي لإنهاء الحجز 📲
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
                          placeholder="اكتب اسمك الكريم هنا..."
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
                        <Form.Label className="fw-bold">مكان الاستلام</Form.Label>
                        <Form.Select
                          className="hamour-input"
                          value={formData.location}
                          onChange={(e) => setFormData({...formData, location: e.target.value})}
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
                        <Form.Label className="fw-bold">الموديل المستهدف للتشطيب</Form.Label>
                        <Form.Select
                          className="hamour-input"
                          value={formData.interestedIn}
                          onChange={(e) => setFormData({...formData, interestedIn: e.target.value})}
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
                    <Form.Label className="fw-bold">ملاحظات المقايسة والمساحة</Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="مثال: مساحة شقتي 150 متر أريد شحنها لحي دير السلطعون..."
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
      <footer className="py-4 text-center border-top border-warning border-opacity-25" style={{ background: 'rgba(15,23,42,0.6)' }}>
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
