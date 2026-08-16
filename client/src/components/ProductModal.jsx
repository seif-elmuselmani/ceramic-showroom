import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { MessageCircle, CheckCircle2, ShieldAlert, Share2, Calculator, Sparkles } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';

const ProductModal = ({ product, show, onHide, settings, onOpenCalculator, onSelectBrand }) => {
  if (!product) return null;

  const hasVariants = Boolean(product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0);

  const availableColors = React.useMemo(() => {
    if (!hasVariants) return [];
    const set = new Set();
    product.variants.forEach(v => { if (v.color && v.color.trim()) set.add(v.color.trim()); });
    return Array.from(set);
  }, [product, hasVariants]);

  const availableCoverTypes = React.useMemo(() => {
    if (!hasVariants) return [];
    const set = new Set();
    product.variants.forEach(v => { if (v.coverType && v.coverType.trim()) set.add(v.coverType.trim()); });
    return Array.from(set);
  }, [product, hasVariants]);

  const [selectedColor, setSelectedColor] = React.useState(() => availableColors[0] || product.color || '');
  const [selectedCoverType, setSelectedCoverType] = React.useState(() => availableCoverTypes[0] || product.coverType || '');

  React.useEffect(() => {
    if (availableColors.length > 0 && (!selectedColor || !availableColors.includes(selectedColor))) {
      setSelectedColor(availableColors[0]);
    }
    if (availableCoverTypes.length > 0 && (!selectedCoverType || !availableCoverTypes.includes(selectedCoverType))) {
      setSelectedCoverType(availableCoverTypes[0]);
    }
  }, [product, availableColors, availableCoverTypes]);

  const activeVariant = React.useMemo(() => {
    if (!hasVariants) return null;
    let match = product.variants.find(v => 
      (v.color || '').trim() === (selectedColor || '').trim() && 
      (v.coverType || '').trim() === (selectedCoverType || '').trim()
    );
    if (!match && selectedColor) {
      match = product.variants.find(v => (v.color || '').trim() === (selectedColor || '').trim());
    }
    if (!match && selectedCoverType) {
      match = product.variants.find(v => (v.coverType || '').trim() === (selectedCoverType || '').trim());
    }
    return match || product.variants[0];
  }, [product, hasVariants, selectedColor, selectedCoverType]);

  const handleColorClick = (colorName) => {
    setSelectedColor(colorName);
    const variantForColor = product.variants.find(v => (v.color || '').trim() === colorName.trim());
    if (variantForColor && variantForColor.coverType) {
      const matchingBoth = product.variants.find(v => (v.color || '').trim() === colorName.trim() && (v.coverType || '').trim() === (selectedCoverType || '').trim());
      if (!matchingBoth) {
        setSelectedCoverType(variantForColor.coverType.trim());
      }
    }
  };

  const handleCoverClick = (coverName) => {
    setSelectedCoverType(coverName);
    const matchingBoth = product.variants.find(v => (v.coverType || '').trim() === coverName.trim() && (v.color || '').trim() === (selectedColor || '').trim());
    if (!matchingBoth) {
      const variantForCover = product.variants.find(v => (v.coverType || '').trim() === coverName.trim());
      if (variantForCover && variantForCover.color) {
        setSelectedColor(variantForCover.color.trim());
      }
    }
  };

  const effectivePrice = activeVariant && activeVariant.price !== undefined && Number(activeVariant.price) > 0 ? Number(activeVariant.price) : Number(product.price);
  const effectiveOriginalPrice = activeVariant && activeVariant.originalPrice !== undefined && Number(activeVariant.originalPrice) > 0 ? Number(activeVariant.originalPrice) : Number(product.originalPrice);
  const effectiveCode = activeVariant && activeVariant.code ? activeVariant.code : product.code;
  const effectiveImage = activeVariant && activeVariant.image ? activeVariant.image : product.image;
  const effectiveColor = selectedColor || (activeVariant && activeVariant.color) || product.color;
  const effectiveCoverType = selectedCoverType || (activeVariant && activeVariant.coverType) || product.coverType;

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

              {/* 7-Star Luxury Variant Selection Box (Exact Match to Customer Request) */}
              {hasVariants && (
                <div className="p-3 mb-3 bg-light rounded-4 border border-slate-200 shadow-sm">
                  {/* Row 1: Color Selection with Color Swatch Dots */}
                  {availableColors.length > 0 && (
                    <div className="mb-3">
                      <div className="fs-7 fw-bold text-dark mb-2 d-flex align-items-center justify-content-between">
                        <span className="d-flex align-items-center gap-1.5">
                          🎨 اللون المختار: <strong className="text-primary">{selectedColor}</strong>
                        </span>
                        <span className="badge bg-white text-muted border rounded-pill px-2.5 py-1 fs-8">
                          {availableColors.length} ألوان متوفرة
                        </span>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        {availableColors.map((colorName) => {
                          const isSelected = selectedColor === colorName;
                          const colorHex = 
                            colorName.includes('أبيض') ? '#ffffff' :
                            colorName.includes('برجامون') || colorName.includes('بيج') ? '#f5e6d3' :
                            colorName.includes('أسود') ? '#1e293b' :
                            colorName.includes('ذهب') ? '#d4af37' :
                            colorName.includes('فض') || colorName.includes('كروم') ? '#cbd5e1' :
                            colorName.includes('رمادي') ? '#64748b' :
                            colorName.includes('خشب') || colorName.includes('بني') ? '#8b5a2b' : '#334155';

                          return (
                            <button
                              key={colorName}
                              type="button"
                              onClick={() => handleColorClick(colorName)}
                              className={`btn rounded-3 px-3 py-2 fs-7 fw-bold transition-all d-flex align-items-center gap-2 ${
                                isSelected 
                                  ? 'bg-dark text-warning border-dark shadow-sm' 
                                  : 'bg-white text-dark border-slate-300 hover-bg-light'
                              }`}
                            >
                              <span 
                                className="rounded-circle border d-inline-block flex-shrink-0"
                                style={{
                                  width: '16px',
                                  height: '16px',
                                  backgroundColor: colorHex,
                                  border: isSelected ? '1px solid #d4af37' : '1px solid #94a3b8'
                                }}
                              />
                              {colorName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Row 2: Cover Type Selection */}
                  {availableCoverTypes.length > 0 && (
                    <div>
                      <div className="fs-7 fw-bold text-dark mb-2 d-flex align-items-center justify-content-between">
                        <span className="d-flex align-items-center gap-1.5">
                          🚽 نوع الغطاء / المواصفة: <strong className="text-primary">{selectedCoverType}</strong>
                        </span>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        {availableCoverTypes.map((coverName) => {
                          const isSelected = selectedCoverType === coverName;
                          return (
                            <button
                              key={coverName}
                              type="button"
                              onClick={() => handleCoverClick(coverName)}
                              className={`btn rounded-3 px-3 py-2 fs-7 fw-bold transition-all ${
                                isSelected 
                                  ? 'bg-dark text-warning border-dark shadow-sm' 
                                  : 'bg-white text-dark border-slate-300 hover-bg-light'
                              }`}
                            >
                              {coverName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
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
