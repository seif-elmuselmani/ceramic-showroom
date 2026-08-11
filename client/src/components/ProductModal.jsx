import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { MessageCircle, CheckCircle2, ShieldAlert, Share2, Calculator } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';

const ProductModal = ({ product, show, onHide, settings, onOpenCalculator }) => {
  if (!product) return null;

  const { hasDiscount, discountPercent, savingsAmount, durationText } = getProductDiscount(product);

  const whatsappNumber = settings?.whatsappNumber || '201000000000';
  const productLink = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;
  const messageText = `مرحباً، أرغب في الاستفسار وحجز الصنف التالي:\n- الاسم: ${product.name}\n- الكود: ${product.code}\n- السعر: ${product.price} ج.م / ${product.priceUnit || 'م2'}${hasDiscount ? ` (بدلاً من ${product.originalPrice} ج.م - وفرت ${savingsAmount} ج.م [خصم ${discountPercent}%])` : ''}\n- الفئة: ${product.category}${product.subcategory ? ` (${product.subcategory})` : ''}\n- رابط الصنف المباشر: ${productLink}\n\nيرجى تأكيد التوافر وموعد المعاينة.`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  const handleShare = async (e) => {
    if (e) e.preventDefault();
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;
    const shareData = {
      title: product.name,
      text: `شاهد سيراميك/بورسلين: ${product.name} (كود: ${product.code}) - في معرض السيد الجزار`,
      url: shareUrl
    };

    try {
      if (navigator.share) {
        await navigator.share(shareData);
      } else {
        await navigator.clipboard.writeText(shareUrl);
        alert('📋 تم نسخ رابط الصنف بنجاح! يمكنك إرساله ومشاركته الآن.');
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

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
                loading="lazy"
                decoding="async"
                style={{ width: '100%', height: '100%', objectFit: 'cover' }} 
              />
            </div>
          </Col>

          <Col md={6} className="d-flex flex-column justify-content-between">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2">
                <Badge bg="warning" text="dark" className="px-3 py-2 fs-6">{product.category}</Badge>
                {product.subcategory && <Badge bg="info" className="text-dark bg-opacity-25 px-3 py-2 fs-6">{product.subcategory}</Badge>}
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

              {/* Price & Offer Card matching Client Screenshot */}
              <div className="p-3 bg-white rounded-4 border mb-3 shadow-sm">
                <div className="d-flex align-items-baseline gap-2 flex-wrap mb-2">
                  <span className="fs-1 fw-black text-dark">{product.price.toLocaleString()}</span>
                  <span className="fs-5 text-muted fw-bold">جنيه / {product.priceUnit || 'م2'}</span>
                  {hasDiscount && (
                    <del className="text-muted fs-6 text-decoration-line-through me-1">
                      {product.originalPrice.toLocaleString()} ج.م
                    </del>
                  )}
                  {hasDiscount && (
                    <span className="badge-pink-discount fs-6">-{discountPercent}%</span>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {hasDiscount && (
                    <span className="pill-savings-green fs-6 px-3 py-1.5">
                      وفرت {savingsAmount.toLocaleString()} جنيه
                    </span>
                  )}
                  {product.inStock ? (
                    <span className="pill-stock-available fs-6 px-3 py-1.5">
                      <span className="stock-dot-green"></span> متوفر
                    </span>
                  ) : (
                    <span className="pill-stock-unavailable fs-6 px-3 py-1.5">
                      غير متوفر حالياً
                    </span>
                  )}
                  {durationText && (
                    <span className="pill-duration-yellow fs-6 px-3 py-1.5">
                      ⏰ {durationText}
                    </span>
                  )}
                </div>
              </div>

              <ul className="list-group list-group-flush mb-3">
                {product.dimensions && (
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">الأبعاد والمقاس:</span>
                    <strong className="text-dark">{product.dimensions}</strong>
                  </li>
                )}
                {product.finish && (
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">نوع التشطيب / اللمعة:</span>
                    <strong className="text-dark">{product.finish}</strong>
                  </li>
                )}
                {product.grade && (
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">درجة الفرز:</span>
                    <strong className="text-dark">{product.grade}</strong>
                  </li>
                )}
                {product.origin && (
                  <li className="list-group-item d-flex justify-content-between px-0">
                    <span className="text-muted">بلد المنشأ / الشركة:</span>
                    <strong className="text-dark">{product.origin}</strong>
                  </li>
                )}
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

      <Modal.Footer className="bg-light p-3 d-flex flex-wrap justify-content-between align-items-center gap-2">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-whatsapp py-2 px-3 fs-6 d-flex align-items-center gap-1"
        >
          <MessageCircle size={20} />
          استفسر أو اطلب معاينة عبر الواتساب مباشرة
        </a>

        {onOpenCalculator && (
          <Button
            variant="outline-warning"
            onClick={() => {
              onHide();
              onOpenCalculator(product);
            }}
            className="d-flex align-items-center gap-1 py-2 px-3 fw-bold text-dark border-warning"
            title="احسب الأمتار والكراتين المطلوبة"
          >
            <Calculator size={18} />
            حاسبة الأمتار والكراتين
          </Button>
        )}

        <Button
          variant="outline-secondary"
          onClick={handleShare}
          className="d-flex align-items-center gap-1 py-2 px-3 fw-bold text-dark border-secondary"
          title="مشاركة رابط الصنف المباشر"
        >
          <Share2 size={18} />
          مشاركة الصنف
        </Button>

        <Button variant="secondary" onClick={onHide}>إغلاق</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default ProductModal;
