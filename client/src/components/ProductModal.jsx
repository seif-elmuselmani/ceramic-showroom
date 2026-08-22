import React from 'react';
import { Modal, Button, Badge, Row, Col, Carousel } from 'react-bootstrap';
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
  const messageText = `السلام عليكم، أود الاستفسار وحجز الصنف التالي:\n\n📦 ${product.name}\n🏷️ الكود: ${effectiveCode || 'غير محدد'}\n\n🔗 الرابط:\n${productLink}\n\nهل الصنف متوفر في المعرض حالياً؟`;
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
    <Modal show={show} onHide={onHide} size="xl" centered className="product-details-modal" dir="rtl">
      <Modal.Header closeButton className="border-0 pb-0 pt-3 pe-4">
        {/* Only Close Button Here */}
      </Modal.Header>
      
      <Modal.Body className="p-4 pt-0">
        <Row className="g-5 align-items-start">
          
          {/* Image Gallery Column */}
          <Col lg={6}>
            <div className="modal-img-container rounded-4 overflow-hidden shadow-sm bg-light text-center position-relative">
              {product.images && product.images.length > 0 ? (
                <Carousel slide={false} interval={null} className="product-carousel">
                  <Carousel.Item>
                    <img
                      src={effectiveImage || product.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'}
                      alt={`${product.name} - الرئيسية`}
                      className="img-fluid w-100 style-modal-product-img"
                      style={{ height: '500px', objectFit: 'cover' }}
                      referrerPolicy="no-referrer"
                      onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'; }}
                    />
                  </Carousel.Item>
                  {product.images.map((imgUrl, idx) => (
                    <Carousel.Item key={idx}>
                      <img
                        src={imgUrl}
                        alt={`${product.name} - ${idx + 1}`}
                        className="img-fluid w-100 style-modal-product-img"
                        style={{ height: '500px', objectFit: 'cover' }}
                        referrerPolicy="no-referrer"
                        onError={(e) => { e.target.onerror = null; e.target.src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'; }}
                      />
                    </Carousel.Item>
                  ))}
                </Carousel>
              ) : (
                <img 
                  src={effectiveImage || product.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80'} 
                  alt={product.name}
                  className="img-fluid w-100 style-modal-product-img"
                  style={{ height: '500px', objectFit: 'cover' }}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80';
                  }}
                />
              )}
            </div>
          </Col>

          {/* Details Column */}
          <Col lg={6}>
            <div className="d-flex flex-column h-100 pb-3">
              
              {/* Badges Breadcrumb */}
              <div className="d-flex align-items-center flex-wrap gap-2 mb-3">
                <Badge bg="light" text="dark" className="px-3 py-1.5 rounded-pill fw-bold border">
                  {product.category}
                </Badge>
                {product.featured && (
                  <Badge bg="warning" text="dark" className="px-3 py-1.5 rounded-pill fw-bold border border-warning">
                    ⭐ صنف مميز
                  </Badge>
                )}
                {product.inStock ? (
                  <Badge bg="success" className="bg-opacity-10 text-success px-3 py-1.5 rounded-pill border border-success fw-bold d-flex align-items-center gap-1">
                    <CheckCircle2 size={14} /> متوفر بالمعرض
                  </Badge>
                ) : (
                  <Badge bg="danger" className="bg-opacity-10 text-danger px-3 py-1.5 rounded-pill border border-danger fw-bold d-flex align-items-center gap-1">
                    <ShieldAlert size={14} /> غير متوفر
                  </Badge>
                )}
              </div>

              {/* Title and Share */}
              <div className="d-flex justify-content-between align-items-start mb-2">
                <h2 className="fw-black text-dark lh-sm mb-0" style={{ fontSize: '1.8rem', letterSpacing: '-0.5px' }}>
                  {product.name}
                </h2>
                <button 
                  onClick={handleShare}
                  className="btn btn-light rounded-circle p-2 ms-2 flex-shrink-0"
                  title="مشاركة رابط الصنف"
                >
                  <Share2 size={20} className="text-secondary" />
                </button>
              </div>
              
              {/* Brand and Code */}
              <div className="d-flex align-items-center flex-wrap gap-3 mb-4 mt-2">
                {product.brand && (
                  <span 
                    className="text-primary fw-bold cursor-pointer hover-opacity"
                    onClick={() => {
                      if (onSelectBrand) onSelectBrand(product.brand);
                      onHide();
                    }}
                  >
                    🏷️ {product.brand}
                  </span>
                )}
                <span className="text-muted fw-bold small">كود الصنف: <span className="text-dark">{effectiveCode}</span></span>
              </div>

              {/* Pricing (Liberated from Box) */}
              <div className="mb-4">
                <div className="d-flex align-items-baseline gap-2 flex-wrap mb-1">
                  <span className="fw-black text-dark" style={{ fontSize: '2.5rem', letterSpacing: '-1px' }}>
                    {(Number(effectivePrice) || 0).toLocaleString()}
                  </span>
                  <span className="fs-5 text-muted fw-bold">جنيه / {product.priceUnit || 'م2'}</span>
                </div>
                
                {hasDiscount && (
                  <div className="d-flex align-items-center gap-3 mt-1">
                    <del className="text-muted fs-5 text-decoration-line-through">
                      {(Number(effectiveOriginalPrice) || 0).toLocaleString()} ج.م
                    </del>
                    <Badge bg="danger" className="px-2 py-1 fs-6 rounded-pill d-flex align-items-center gap-1 shadow-sm">
                      وفرت {(Number(savingsAmount) || 0).toLocaleString()} ج
                    </Badge>
                  </div>
                )}
              </div>

              {/* Variants (Colors and Covers) */}
              {hasVariants && (
                <div className="mb-4">
                  
                  {/* Colors */}
                  {availableColors.length > 0 && (
                    <div className="mb-4">
                      <div className="fs-7 fw-bold text-secondary mb-3 d-flex align-items-center justify-content-between">
                        <span>اللون: <strong className="text-dark fs-6">{selectedColor}</strong></span>
                      </div>
                      <div className="d-flex flex-wrap gap-3">
                        {availableColors.map((colorName) => {
                          const isSelected = selectedColor === colorName;
                          
                          const colorHex = 
                            colorName.includes('أبيض') ? '#ffffff' :
                            colorName.includes('برجامون') || colorName.includes('بيج') || colorName.includes('عاجي') ? '#f5e6d3' :
                            colorName.includes('أسود') ? '#1e293b' :
                            colorName.includes('ذهب') ? '#d4af37' :
                            colorName.includes('فض') || colorName.includes('كروم') ? '#cbd5e1' :
                            colorName.includes('رمادي') ? '#64748b' :
                            colorName.includes('خشب') || colorName.includes('بني') ? '#8b5a2b' : 
                            colorName.includes('أزرق') || colorName.includes('كحلي') ? '#1d4ed8' :
                            colorName.includes('أخضر') ? '#15803d' :
                            colorName.includes('أحمر') ? '#b91c1c' : '#334155';

                          return (
                            <div
                              key={colorName}
                              title={colorName}
                              onClick={() => handleColorClick(colorName)}
                              className={`color-swatch-luxury ${isSelected ? 'active' : ''}`}
                              style={{
                                backgroundColor: colorHex,
                              }}
                            />
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Cover Types */}
                  {availableCoverTypes.length > 0 && (
                    <div className="mb-4">
                      <div className="fs-7 fw-bold text-secondary mb-3">المواصفة / نوع الغطاء:</div>
                      <div className="d-flex flex-wrap gap-2">
                        {availableCoverTypes.map((coverName) => {
                          const isSelected = selectedCoverType === coverName;
                          const v = product.variants.find(v => (v.coverType || '').trim() === coverName && (v.color || '').trim() === selectedColor);
                          const currentBasePrice = Number(product.price) || 0;
                          const variantPrice = v && v.price ? Number(v.price) : currentBasePrice;
                          const diff = variantPrice - currentBasePrice;
                          
                          let priceBadge = '';
                          if (diff > 0) priceBadge = ` (+${diff.toLocaleString()} ج)`;
                          else if (diff < 0) priceBadge = ` (-${Math.abs(diff).toLocaleString()} ج)`;

                          return (
                            <button
                              key={coverName}
                              type="button"
                              onClick={() => handleCoverClick(coverName)}
                              className={`variant-pill-luxury ${isSelected ? 'active' : ''}`}
                            >
                              {coverName} <small className={diff > 0 ? 'text-warning' : ''}>{priceBadge}</small>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Specs Grid */}
              <div className="specs-grid-luxury mb-4">
                {product.dimensions && (
                  <div className="spec-item">
                    <span className="spec-item-label">المقاس والأبعاد</span>
                    <span className="spec-item-value">{product.dimensions}</span>
                  </div>
                )}
                {product.finish && (
                  <div className="spec-item">
                    <span className="spec-item-label">نوع التشطيب</span>
                    <span className="spec-item-value">{product.finish}</span>
                  </div>
                )}
                {product.grade && (
                  <div className="spec-item">
                    <span className="spec-item-label">درجة الفرز</span>
                    <span className="spec-item-value">{product.grade}</span>
                  </div>
                )}
                {product.origin && (
                  <div className="spec-item">
                    <span className="spec-item-label">بلد المنشأ</span>
                    <span className="spec-item-value">{product.origin}</span>
                  </div>
                )}
              </div>

              {/* Description */}
              {product.description && (
                <div className="mb-4">
                  <h6 className="fw-bold text-dark mb-2">وصف المنتج</h6>
                  <p className="text-muted" style={{ fontSize: '0.95rem', lineHeight: '1.6' }}>{product.description}</p>
                </div>
              )}

              {/* Action Buttons (Footer moved up to avoid weird standard footer) */}
              <div className="mt-auto d-flex flex-column gap-3 pt-4 border-top">
                <a 
                  href={whatsappUrl} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="whatsapp-btn-luxury"
                >
                  <MessageCircle size={24} />
                  استفسر أو اطلب معاينة عبر الواتساب مباشرة
                </a>

                {onOpenCalculator && (
                  <button
                    onClick={() => {
                      onHide();
                      onOpenCalculator(product);
                    }}
                    className="btn btn-outline-dark rounded-4 py-3 fw-bold d-flex align-items-center justify-content-center gap-2"
                    title={product.priceUnit && (product.priceUnit.includes('قطعة') || product.priceUnit.includes('طقم') || product.priceUnit.includes('وحدة') || product.category?.includes('أطقم')) ? "حساب الكمية والقطع المطلوبة" : "احسب الأمتار والكراتين المطلوبة"}
                  >
                    <Calculator size={20} />
                    {product.priceUnit && (product.priceUnit.includes('قطعة') || product.priceUnit.includes('طقم') || product.priceUnit.includes('وحدة') || product.category?.includes('أطقم')) ? "حاسبة الكمية والقطع" : "حاسبة الأمتار والكراتين"}
                  </button>
                )}
              </div>
            </div>
          </Col>
        </Row>
      </Modal.Body>
    </Modal>
  );
};

export default ProductModal;
