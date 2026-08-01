import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { MessageCircle, CheckCircle2, ShieldAlert, Sparkles, MapPin, Tag } from 'lucide-react';

const ProductModal = ({ product, show, onHide, settings }) => {
  if (!product) return null;

  const whatsappNumber = settings?.whatsappNumber || '201000000000';
  const messageText = `مرحباً، أرغب في الاستفسار وحجز الصنف التالي:\n- الاسم: ${product.name}\n- الكود: ${product.code}\n- السعر: ${product.price} ج.م / ${product.priceUnit || 'م2'}\n- الفئة: ${product.category}`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-luxury">
      <Modal.Header closeButton className="modal-header-luxury">
        <Modal.Title className="d-flex align-items-center gap-2">
          <Sparkles className="text-warning" size={24} />
          <span>تفاصيل صنف السيراميك / البورسلين</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <Row className="g-4">
          <Col md={6}>
            <div className="rounded-4 overflow-hidden border shadow-sm" style={{ height: '320px', backgroundColor: '#0f172a' }}>
              <img 
                src={product.image} 
                alt={product.name} 
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </Col>

          <Col md={6} className="d-flex flex-direction-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="warning" text="dark" className="px-3 py-2 fs-6">{product.category}</Badge>
                {product.inStock ? (
                  <Badge bg="success" className="px-3 py-2 fs-6 d-flex align-items-center gap-1">
                    <CheckCircle2 size={16} /> متوفر بالمعرض
                  </Badge>
                ) : (
                  <Badge bg="danger" className="px-3 py-2 fs-6 d-flex align-items-center gap-1">
                    <ShieldAlert size={16} /> غير متوفر
                  </Badge>
                )}
              </div>

              <h4 className="fw-bold text-dark mt-2 mb-2">{product.name}</h4>
              <p className="text-muted mb-3">كود الصنف الخاص: <span className="badge bg-secondary">{product.code}</span></p>

              <div className="p-3 bg-light rounded-3 border mb-3">
                <div className="text-muted small">سعر المتر / الوحدة:</div>
                <div className="d-flex align-items-baseline gap-2">
                  <span className="fs-2 fw-black text-success">{product.price}</span>
                  <span className="fs-5 text-dark fw-bold">جنيه مصري / {product.priceUnit || 'متر مربع'}</span>
                </div>
              </div>

              <ul className="list-group list-group-flush mb-3">
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted">الأبعاد والمقاس:</span>
                  <strong className="text-dark">{product.dimensions || 'غير محدد'}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted">نوع التشطيب / اللمعة:</span>
                  <strong className="text-dark">{product.finish || 'غير محدد'}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted">درجة الفرز:</span>
                  <strong className="text-dark">{product.grade || 'فرز أول'}</strong>
                </li>
                <li className="list-group-item d-flex justify-content-between px-0">
                  <span className="text-muted">بلد المنشأ / الشركة:</span>
                  <strong className="text-dark">{product.origin || 'مصر'}</strong>
                </li>
                {product.usage && (
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">الاستخدام المقترح:</span>
                    <strong className="text-dark">{product.usage}</strong>
                  </li>
                )}
              </ul>

              {product.description && (
                <div className="mb-3">
                  <div className="fw-bold text-dark mb-1">وصف الصنف:</div>
                  <p className="text-muted small">{product.description}</p>
                </div>
              )}
            </div>
          </Col>
        </Row>
      </Modal.Body>

      <Modal.Footer className="bg-light p-3">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-whatsapp py-2 px-4 fs-6"
        >
          <MessageCircle size={20} />
          استفسر أو اطلب معاينة عبر الواتساب مباشرة
        </a>
        <Button variant="outline-secondary" onClick={onHide}>إغلاق</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
