import React from 'react';
import { Container, Row, Col } from 'react-bootstrap';
import { Layers, MapPin, Phone, Clock, MessageSquare } from 'lucide-react';

const Footer = ({ settings }) => {
  return (
    <footer className="luxury-footer" id="contact-section">
      <Container>
        <Row className="g-4">
          <Col md={4}>
            <div className="d-flex align-items-center gap-2 mb-3">
              <Layers className="text-warning" size={30} />
              <h4 className="footer-title mb-0">{settings?.showroomName || 'معرض السيراميك والبورسلين'}</h4>
            </div>
            <p className="small text-muted leading-relaxed">
              {settings?.tagline || 'نوفر لك أفضل تشكيلات السيراميك والبورسلين المحلي والمستورد بأعلى درجات الجودة وأفضل أسعار السوق.'}
            </p>
          </Col>

          <Col md={4}>
            <h5 className="footer-title">معلومات المعرض والتواصل</h5>
            <ul className="list-unstyled text-muted small">
              <li className="d-flex align-items-center gap-2 mb-3">
                <MapPin className="text-warning flex-shrink-0" size={18} />
                <span>{settings?.address || 'القاهرة - شارع مكرم عبيد - مدينة نصر'}</span>
              </li>
              <li className="d-flex align-items-center gap-2 mb-3">
                <Phone className="text-warning flex-shrink-0" size={18} />
                <span>المبيعات والاستعلام: {settings?.phoneNumber || '01000000000'}</span>
              </li>
              <li className="d-flex align-items-center gap-2 mb-3">
                <Clock className="text-warning flex-shrink-0" size={18} />
                <span>أوقات العمل: {settings?.workingHours || 'يومياً من 10 ص حتى 11 م'}</span>
              </li>
            </ul>
          </Col>

          <Col md={4}>
            <h5 className="footer-title">خدمة العملاء والطلب</h5>
            <p className="small text-muted mb-3">
              يمكنك زيارتنا في المعرض لمعاينة الخامات على الطبيعة أو التواصل فوراً عبر الواتساب للاستفسار عن توفر الأصناف والكميات.
            </p>
            <a 
              href={`https://wa.me/${settings?.whatsappNumber || '201000000000'}`} 
              target="_blank" 
              rel="noopener noreferrer" 
              className="btn-whatsapp text-center"
            >
              <MessageSquare size={18} />
              راسلنا مباشرة عبر الواتساب
            </a>
          </Col>
        </Row>

        <hr className="my-4 border-secondary" />

        <div className="text-center text-muted small">
          جميع الحقوق محفوظة &copy; {new Date().getFullYear()} - {settings?.showroomName || 'معرض السيراميك والبورسلين'} | كتالوج الكتروني للعرض والأسعار
        </div>
      </Container>
    </footer>
  );
};

export default Footer;
