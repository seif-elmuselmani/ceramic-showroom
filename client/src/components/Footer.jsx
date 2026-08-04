import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { MapPin, Phone, Clock, MessageSquare, Facebook } from 'lucide-react';

const Footer = ({ settings, onNavigate, categories = [] }) => {
  // Split the address dynamically by "|" to display branch cards nicely
  const branches = settings?.address?.split('|') || [];

  // Individual branch map links fallback
  const mapUrls = [
    settings?.mapUrl1 || 'https://www.google.com/maps/search/?api=1&query=%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%B9%D8%B7%D8%A7%D8%B1+%D9%85%D8%AF%D8%AE%D9%84+%D8%A8%D9%86%D9%87%D8%A7+%D8%A7%D9%84%D9%82%D8%A8%D9%84%D9%8A',
    settings?.mapUrl2 || settings?.mapUrl || 'https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&FORM=FBKPL1&q=%D8%A7%D9%84%D8%B9%D9%86%D9%88%D8%A7%D9%86%3A+%D8%A8%D9%86%D9%87%D8%A7+-%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%B3%D9%86%D9%87%D9%88%D9%89+%E2%80%93+%D8%A8%D8%AC%D9%88%D8%A7%D8%B1+%D9%83%D9%88%D8%A8%D8%B1%D9%8A+%D8%A7%D9%84%D8%B4%D9%85%D9%88%D8%AA%2C+Benha%2C+Egypt%2C+013&cp=30.460002%7E31.183300&lvl=13.4&style=r'
  ];

  return (
    <footer className="luxury-footer" id="contact-section">
      <Container>
        <Row className="g-4">
          {/* Column 1: Showroom Branding & Socials */}
          <Col lg={4} md={6}>
            <div className="footer-brand-section mb-3">
              <img 
                src="/Logo.png" 
                alt="Logo" 
                className="footer-logo" 
                onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=100&q=80'; }}
              />
              <div>
                <h4 className="footer-title mb-0">{settings?.showroomName || 'السيد الجزار للسيراميك'}</h4>
                <span className="footer-tagline-sub">سيراميك - بورسلين - أدوات صحية</span>
              </div>
            </div>
            <p className="footer-desc mb-4">
              {settings?.tagline || 'معرض السيد الجزار - فخامة السيراميك والبورسلين في مكان واحد بأفضل الأسعار'}
            </p>
            
            {/* Elegant Circular Social Icons */}
            <div className="d-flex align-items-center gap-2 footer-socials">
              <a 
                href={`https://wa.me/${settings?.whatsappNumber || '201000000000'}`} 
                target="_blank" 
                rel="noopener noreferrer" 
                className="social-icon-btn whatsapp"
                title="راسلنا على واتساب"
              >
                <MessageSquare size={18} />
              </a>

              {settings?.facebookUrl && (
                <a 
                  href={settings.facebookUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon-btn facebook"
                  title="تابعنا على فيسبوك"
                >
                  <Facebook size={18} />
                </a>
              )}

              {settings?.tiktokUrl && (
                <a 
                  href={settings.tiktokUrl} 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="social-icon-btn tiktok"
                  title="تابعنا على تيك توك"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M9 12a4 4 0 1 0 4 4V4a5 5 0 0 0 5 5" />
                  </svg>
                </a>
              )}
            </div>
          </Col>

          {/* Column 2: Quick Links */}
          <Col lg={3} md={6} className="ps-lg-5">
            <h5 className="footer-title-sec">تصفح الكتالوج</h5>
            <ul className="footer-links list-unstyled">
              {categories && categories.length > 0 ? (
                categories.map((cat) => (
                  <li key={cat.id}>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('catalog', cat.name); }}>
                      {cat.name}
                    </a>
                  </li>
                ))
              ) : (
                <>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('catalog'); }}>
                      بورسلين مستورد
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('catalog'); }}>
                      بورسلين محلي
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('catalog'); }}>
                      سيراميك أرضيات
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('catalog'); }}>
                      سيراميك حوائط
                    </a>
                  </li>
                  <li>
                    <a href="#" onClick={(e) => { e.preventDefault(); onNavigate && onNavigate('catalog'); }}>
                      أطقم حمامات وخلاطات
                    </a>
                  </li>
                </>
              )}
            </ul>
          </Col>

          {/* Column 3: Branches & Contact Grid */}
          <Col lg={5} md={12}>
            <h5 className="footer-title-sec">فروع المعرض والتواصل</h5>
            <div className="footer-branches-grid">
              {branches.map((branch, idx) => (
                <div key={idx} className="footer-branch-item">
                  <MapPin className="text-warning flex-shrink-0" size={18} />
                  <div>
                    <h6 className="branch-name mb-1">الفرع {idx + 1}</h6>
                    {mapUrls[idx] ? (
                      <a 
                        href={mapUrls[idx]} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="branch-link"
                      >
                        {branch.replace(/^فرع \d+:\s*/i, '').trim()}
                      </a>
                    ) : (
                      <span className="branch-text">{branch.replace(/^فرع \d+:\s*/i, '').trim()}</span>
                    )}
                  </div>
                </div>
              ))}
            </div>

            <hr className="my-3 border-secondary border-opacity-25" />

            <div className="d-flex flex-wrap gap-4 mt-3">
              <div className="footer-contact-info">
                <Phone className="text-warning flex-shrink-0" size={18} />
                <div>
                  <span className="contact-label d-block">المبيعات والاستعلام</span>
                  <a href={`tel:${settings?.phoneNumber}`} className="contact-value">
                    {settings?.phoneNumber || '01000000000'}
                  </a>
                </div>
              </div>

              <div className="footer-contact-info">
                <Clock className="text-warning flex-shrink-0" size={18} />
                <div>
                  <span className="contact-label d-block">أوقات العمل اليومية</span>
                  <span className="contact-value-text">
                    {settings?.workingHours || 'يومياً من 10 ص حتى 11:30 م'}
                  </span>
                </div>
              </div>
            </div>
          </Col>
        </Row>

        <div className="footer-bottom mt-5">
          <p className="mb-0">
            جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - {settings?.showroomName || 'معرض السيد الجزار للسيراميك والبورسلين'}
          </p>
          <span className="footer-credits">كتالوج إلكتروني متكامل لعرض الأصناف والأسعار المحدثة</span>
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
