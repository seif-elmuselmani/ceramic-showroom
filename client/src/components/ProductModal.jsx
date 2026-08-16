import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { MessageCircle, CheckCircle2, ShieldAlert, Share2, Calculator, Sparkles } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';

const ProductModal = ({ product, show, onHide, settings, onOpenCalculator, onSelectBrand }) => {
  if (!product) return null;

  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(product.activeVariantIndex || 0);

  React.useEffect(() => {
    if (product.activeVariantIndex !== undefined) {
      setSelectedVariantIndex(product.activeVariantIndex);
    } else {
      setSelectedVariantIndex(0);
    }
  }, [product]);

  const hasVariants = Boolean(product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0);
  const activeVariant = hasVariants ? (product.variants[selectedVariantIndex] || product.variants[0]) : null;

  const effectivePrice = activeVariant && activeVariant.price !== undefined ? Number(activeVariant.price) : Number(product.price);
  const effectiveOriginalPrice = activeVariant && activeVariant.originalPrice !== undefined ? Number(activeVariant.originalPrice) : Number(product.originalPrice);
  const effectiveCode = activeVariant && activeVariant.code ? activeVariant.code : product.code;
  const effectiveImage = activeVariant && activeVariant.image ? activeVariant.image : product.image;
  const effectiveColor = activeVariant && activeVariant.color ? activeVariant.color : product.color;
  const effectiveCoverType = activeVariant && activeVariant.coverType ? activeVariant.coverType : product.coverType;

  const { hasDiscount, discountPercent, savingsAmount, durationText } = getProductDiscount(product, activeVariant);

  const whatsappNumber = settings?.whatsappNumber || '201000000000';
  const productLink = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;
  const messageText = `السلام عليكم ورحمة الله وبركاته 💐
أود الاستفسار وحجز طلبية صنف السيراميك/البورسلين التالي:

📦 اسم الصنف: ${product.name}
🏷️ كود الصنف: ${effectiveCode || 'غير محدد'}
📂 الفئة: ${product.category}${product.subcategory ? ` (${product.subcategory})` : ''}
${effectiveColor ? `🎨 اللون المختار: ${effectiveColor}\n` : ''}${effectiveCoverType ? `🚽 نوع الغطاء: ${effectiveCoverType}\n` : ''}📐 المقاس والتشطيب: ${product.dimensions || 'قياسي'} | ${product.finish || 'ممتاز'}
🏭 بلد المنشأ: ${product.origin || 'مستورد'}
💰 السعر الحالي: ${effectivePrice} ج.م / ${product.priceUnit || 'م2'}${hasDiscount ? ` (بدلاً من ${effectiveOriginalPrice} ج.م - ووفرت ${savingsAmount} ج.م [خصم ${discountPercent}%])` : ''}

🔗 رابط معاينة الصنف بالموقع:
${productLink}

يرجى تأكيد التوافر بالمخزن وأقرب فرع للمعاينة تسليم فوري. 🙏✨`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  const handleShare = async (e) => {
    if (e) e.preventDefault();
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;
    const shareData = {
      title: product.name,
      text: `شاهد سيراميك/بورسلين: ${product.name} (كود: ${effectiveCode}) - في معرض السيد الجزار`,
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
    <Modal show={show} onHide={onHide} size="lg" centered className="product-details-modal">
      <Modal.Header closeButton className="border-0 pb-0">
        <div className="d-flex align-items-center gap-2">
          <Badge bg="warning" text="dark" className="px-3 py-1.5 rounded-pill fw-bold">
            {product.category}
          </Badge>
          {product.featured && (
            <Badge bg="dark" className="px-3 py-1.5 rounded-pill fw-bold">
              ⭐ صنف مميز
            </Badge>
          )}
        </div>
      </Modal.Header>
      
      <Modal.Body className="p-4 pt-2">
        <Row className="g-4 align-items-start">
          <Col lg={6}>
            <div className="modal-img-container rounded-4 overflow-hidden shadow-sm border bg-light text-center">
              <img 
                src={effectiveImage || product.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'} 
                alt={product.name}
                className="img-fluid w-100 style-modal-product-img"
                style={{ maxHeight: '420px', objectFit: 'cover' }}
                referrerPolicy="no-referrer"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80';
                }}
              />
            </div>
          </Col>

          <Col lg={6}>
            <div>
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="badge bg-light text-muted border">كود الصنف: {effectiveCode}</span>
                {product.inStock ? (
                  <Badge bg="success" className="px-3 py-1.5 rounded-pill d-flex align-items-center gap-1">
                    <CheckCircle2 size={16} /> متوفر بالمعرض
                  </Badge>
                ) : (
                  <Badge bg="danger" className="px-3 py-1.5 rounded-pill d-flex align-items-center gap-1">
                    <ShieldAlert size={16} /> غير متوفر
                  </Badge>
                )}
              </div>

              <h4 className="fw-bold text-dark mt-2 mb-2">{product.name}</h4>
              
              {product.brand && (
                <div className="mb-3">
                  <span 
                    className="badge bg-light text-dark border px-3 py-2 brand-chip-link cursor-pointer shadow-sm fs-7"
                    onClick={() => {
                      if (onSelectBrand) onSelectBrand(product.brand);
                      onHide();
                    }}
                    title="انقر لعرض جميع أصناف هذه الماركة"
                    style={{ cursor: 'pointer' }}
                  >
                    🏷️ الماركة: <strong className="text-primary">{product.brand}</strong> ↗
                  </span>
                </div>
              )}

              {/* Interactive Luxury Variant Selection Box (Colors & Cover Types with Color Swatches) */}
              {hasVariants && (
                <div className="p-3 mb-3 bg-white rounded-4 border shadow-sm">
                  <div className="d-flex align-items-center justify-content-between mb-2 pb-2 border-bottom">
                    <span className="fw-bold text-dark fs-7 d-flex align-items-center gap-1.5">
                      <Sparkles size={18} className="text-warning" />
                      اختر اللون والغطاء المطلوبين للصنف:
                    </span>
                    <span className="badge bg-warning text-dark border border-warning-subtle rounded-pill px-2.5 py-1 fs-8 fw-bold">
                      {product.variants.length} خيارات متاحة
                    </span>
                  </div>

                  <div className="d-flex flex-column gap-2">
                    {product.variants.map((variant, vIdx) => {
                      const isSelected = selectedVariantIndex === vIdx;
                      const colorHex = variant.color ? (
                        variant.color.includes('أبيض') ? '#ffffff' :
                        variant.color.includes('برجامون') || variant.color.includes('بيج') ? '#f5e6d3' :
                        variant.color.includes('أسود') ? '#1e293b' :
                        variant.color.includes('ذهب') ? '#d4af37' :
                        variant.color.includes('فض') || variant.color.includes('كروم') ? '#cbd5e1' :
                        variant.color.includes('رمادي') ? '#64748b' :
                        variant.color.includes('خشب') || variant.color.includes('بني') ? '#8b5a2b' : '#e2e8f0'
                      ) : '#ffffff';

                      const vPrice = variant.price !== undefined ? Number(variant.price) : Number(product.price);

                      return (
                        <button
                          key={variant.id || vIdx}
                          type="button"
                          onClick={() => setSelectedVariantIndex(vIdx)}
                          className={`btn rounded-3 p-2.5 d-flex align-items-center justify-content-between transition-all border ${
                            isSelected 
                              ? 'bg-warning bg-opacity-15 border-warning text-dark shadow-sm fw-bold' 
                              : 'bg-light text-dark border-slate-200 hover-bg-white'
                          }`}
                          style={{ textAlign: 'right' }}
                        >
                          <div className="d-flex align-items-center gap-2 overflow-hidden">
                            {variant.color && (
                              <span 
                                className="rounded-circle border border-secondary shadow-xs d-inline-block flex-shrink-0"
                                style={{ 
                                  width: '18px', 
                                  height: '18px', 
                                  backgroundColor: colorHex,
                                  boxShadow: isSelected ? '0 0 0 2px #d4af37' : 'none'
                                }}
                              />
                            )}
                            <div className="d-flex flex-column text-start">
                              <span className="fs-7 fw-bold text-dark">
                                {variant.color || `خيار ${vIdx + 1}`}
                              </span>
                              {variant.coverType && (
                                <span className="fs-8 text-muted fw-semibold">
                                  🚽 {variant.coverType}
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="text-end">
                            <span className={`fs-7 fw-bold px-3 py-1 rounded-pill ${
                              isSelected ? 'bg-dark text-warning' : 'bg-white text-dark border'
                            }`}>
                              {vPrice.toLocaleString()} ج.م
                            </span>
                          </div>
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}

              <div className="p-3 bg-white rounded-4 border mb-3 shadow-sm">
                <div className="d-flex align-items-baseline gap-2 flex-wrap mb-2">
                  <span className="fs-1 fw-black text-dark">{(Number(effectivePrice) || 0).toLocaleString()}</span>
                  <span className="fs-5 text-muted fw-bold">جنيه / {product.priceUnit || 'م2'}</span>
                  {hasDiscount && (
                    <del className="text-muted fs-6 text-decoration-line-through me-1">
                      {(Number(effectiveOriginalPrice) || 0).toLocaleString()} ج.م
                    </del>
                  )}
                  {hasDiscount && (
                    <span className="badge-pink-discount fs-6">-{discountPercent}%</span>
                  )}
                </div>

                <div className="d-flex align-items-center gap-2 flex-wrap">
                  {hasDiscount && (
                    <span className="pill-savings-green fs-6 px-3 py-1.5">
                      وفرت {(Number(savingsAmount) || 0).toLocaleString()} جنيه
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
            title={product.priceUnit && (product.priceUnit.includes('قطعة') || product.priceUnit.includes('طقم') || product.priceUnit.includes('وحدة') || product.category?.includes('أطقم')) ? "حساب الكمية والقطع المطلوبة" : "احسب الأمتار والكراتين المطلوبة"}
          >
            <Calculator size={18} />
            {product.priceUnit && (product.priceUnit.includes('قطعة') || product.priceUnit.includes('طقم') || product.priceUnit.includes('وحدة') || product.category?.includes('أطقم')) ? "حاسبة الكمية والقطع" : "حاسبة الأمتار والكراتين"}
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
