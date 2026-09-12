import React from 'react';
import { Modal, Button, Badge, Row, Col } from 'react-bootstrap';
import { MessageCircle, CheckCircle2, ShieldAlert, Share2, Calculator, Sparkles, X, ChevronLeft, ChevronRight, Images } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';
import { getColorHexFromName } from '../utils/colorMapper';

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

  // Dynamic Schema.org Product JSON-LD injection for Google Rich Snippets
  React.useEffect(() => {
    if (!product || !show) return;
    const effectivePrice = (product.discountPercent > 0 && product.discountPrice) ? product.discountPrice : product.price;
    const schemaData = {
      "@context": "https://schema.org/",
      "@type": "Product",
      "name": product.name,
      "image": [product.image, ...(product.gallery || [])].filter(Boolean),
      "description": product.description || `${product.name} - فرز ${product.grade || 'أول'} متاح لدى معرض السيد الجزار للسيراميك والبورسلين`,
      "brand": {
        "@type": "Brand",
        "name": product.brand || 'معرض السيد الجزار'
      },
      "category": product.category,
      "offers": {
        "@type": "Offer",
        "url": typeof window !== 'undefined' ? window.location.href : 'https://ceramic-showroom.vercel.app',
        "priceCurrency": "EGP",
        "price": effectivePrice || 0,
        "availability": product.inStock !== false ? "https://schema.org/InStock" : "https://schema.org/OutOfStock",
        "itemCondition": "https://schema.org/NewCondition",
        "seller": {
          "@type": "Organization",
          "name": settings?.showroomName || "معرض السيد الجزار للسيراميك والبورسلين"
        }
      }
    };

    let scriptEl = document.getElementById('product-schema-jsonld');
    if (!scriptEl) {
      scriptEl = document.createElement('script');
      scriptEl.id = 'product-schema-jsonld';
      scriptEl.type = 'application/ld+json';
      document.head.appendChild(scriptEl);
    }
    scriptEl.textContent = JSON.stringify(schemaData);

    return () => {
      const el = document.getElementById('product-schema-jsonld');
      if (el) el.remove();
    };
  }, [product, show, settings?.showroomName]);

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
  const effectiveInStock = activeVariant && activeVariant.inStock !== undefined ? (activeVariant.inStock !== false) : (product.inStock !== false);

  // Collect all unique images for the interactive gallery
  const galleryImages = React.useMemo(() => {
    const list = [];
    if (effectiveImage && typeof effectiveImage === 'string' && effectiveImage.trim()) {
      list.push(effectiveImage.trim());
    } else if (product.image && typeof product.image === 'string' && product.image.trim()) {
      list.push(product.image.trim());
    }

    if (Array.isArray(product.images)) {
      product.images.forEach(img => {
        if (img && typeof img === 'string' && img.trim() && !list.includes(img.trim())) {
          list.push(img.trim());
        }
      });
    }

    // Also include other variant images if present
    if (Array.isArray(product.variants)) {
      product.variants.forEach(v => {
        if (v && v.image && typeof v.image === 'string' && v.image.trim() && !list.includes(v.image.trim())) {
          list.push(v.image.trim());
        }
      });
    }

    if (list.length === 0) {
      list.push('https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80');
    }
    return list;
  }, [product, effectiveImage]);

  const [activeImageIndex, setActiveImageIndex] = React.useState(0);

  // Reset active image when product or selected variant changes
  React.useEffect(() => {
    setActiveImageIndex(0);
  }, [product?.id, effectiveImage]);

  const handlePrevImage = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev === 0 ? galleryImages.length - 1 : prev - 1));
  };

  const handleNextImage = (e) => {
    if (e) e.stopPropagation();
    setActiveImageIndex((prev) => (prev === galleryImages.length - 1 ? 0 : prev + 1));
  };

  const isColorInStock = (colorName) => {
    if (!hasVariants) return product.inStock !== false;
    const variantsForColor = product.variants.filter(v => (v.color || '').trim() === colorName.trim());
    if (variantsForColor.length === 0) return true;
    return variantsForColor.some(v => v.inStock !== false);
  };

  const { hasDiscount, discountPercent, savingsAmount, durationText } = getProductDiscount(product, activeVariant);

  const whatsappNumber = settings?.whatsappNumber || '201000000000';
  const productLink = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;
  const messageText = effectiveInStock
    ? `السلام عليكم، أود الاستفسار وحجز الصنف التالي:\n\n📦 ${product.name}\n🏷️ الكود: ${effectiveCode || 'غير محدد'}${hasVariants && effectiveColor ? `\n🎨 اللون: ${effectiveColor}` : ''}${hasVariants && effectiveCoverType ? `\n🔘 المواصفة: ${effectiveCoverType}` : ''}\n\n🔗 الرابط:\n${productLink}\n\nهل الصنف متوفر في المعرض حالياً؟`
    : `السلام عليكم، أود الاستفسار عن موعد توفر الصنف التالي:\n\n📦 ${product.name}\n🏷️ الكود: ${effectiveCode || 'غير محدد'}${hasVariants && effectiveColor ? `\n🎨 اللون: ${effectiveColor} (يظهر كغير متوفر حالياً)` : ''}\n\n🔗 الرابط:\n${productLink}\n\nمتى يتوقع توفر هذا اللون بالمعرض؟`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  const handleShare = async (e) => {
    if (e) e.preventDefault();
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;
    const shareData = {
      title: `${product.name} | معرض السيد الجزار`,
      text: `شاهد ${product.name} من معرض السيد الجزار للسيراميك والبورسلين:\n`,
      url: shareUrl,
    };

    try {
      if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
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
      {/* Explicit Luxury Close Button */}
      <button
        type="button"
        onClick={onHide}
        className="btn position-absolute top-0 end-0 m-3 rounded-circle shadow-sm d-flex align-items-center justify-content-center p-0"
        style={{
          width: '38px',
          height: '38px',
          zIndex: 1090,
          backgroundColor: '#f8fafc',
          border: '1px solid #e2e8f0',
          cursor: 'pointer',
          transition: 'all 0.2s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.backgroundColor = '#ef4444';
          e.currentTarget.style.borderColor = '#ef4444';
          e.currentTarget.style.color = '#ffffff';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.backgroundColor = '#f8fafc';
          e.currentTarget.style.borderColor = '#e2e8f0';
          e.currentTarget.style.color = '#1e293b';
        }}
        aria-label="إغلاق النافذة"
      >
        <X size={20} />
      </button>
      
      <Modal.Body className="p-4 pt-4">
        <Row className="g-5 align-items-start">
          
          {/* Interactive Multi-Image Gallery Column */}
          <Col lg={6}>
            <div className="modal-gallery-wrapper">
              {/* Main Active Large Image */}
              <div className="modal-main-img-box rounded-4 overflow-hidden shadow-sm bg-light text-center position-relative border">
                <img 
                  src={galleryImages[activeImageIndex] || galleryImages[0]} 
                  alt={`${product.name} - صورة ${activeImageIndex + 1}`}
                  className="img-fluid w-100 style-modal-product-img"
                  style={{ height: '440px', objectFit: 'cover', transition: 'all 0.3s ease' }}
                  referrerPolicy="no-referrer"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1000&q=80';
                  }}
                />

                {/* Photo Counter Badge */}
                {galleryImages.length > 1 && (
                  <div 
                    className="position-absolute top-0 start-0 m-3 px-3 py-1 rounded-pill text-white fw-bold d-flex align-items-center gap-1 shadow-sm"
                    style={{ background: 'rgba(15, 23, 42, 0.75)', backdropFilter: 'blur(6px)', fontSize: '0.78rem', zIndex: 5 }}
                  >
                    <Images size={14} className="text-warning" />
                    <span>{activeImageIndex + 1} / {galleryImages.length}</span>
                  </div>
                )}

                {/* Left / Right Carousel Navigation Arrows */}
                {galleryImages.length > 1 && (
                  <>
                    <button
                      type="button"
                      className="btn position-absolute top-50 start-0 translate-middle-y ms-2 rounded-circle d-flex align-items-center justify-content-center shadow-lg border-0"
                      style={{ width: '42px', height: '42px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0f172a', zIndex: 6 }}
                      onClick={handlePrevImage}
                      aria-label="الصورة السابقة"
                    >
                      <ChevronRight size={22} />
                    </button>
                    <button
                      type="button"
                      className="btn position-absolute top-50 end-0 translate-middle-y me-2 rounded-circle d-flex align-items-center justify-content-center shadow-lg border-0"
                      style={{ width: '42px', height: '42px', backgroundColor: 'rgba(255, 255, 255, 0.9)', color: '#0f172a', zIndex: 6 }}
                      onClick={handleNextImage}
                      aria-label="الصورة التالية"
                    >
                      <ChevronLeft size={22} />
                    </button>
                  </>
                )}
              </div>

              {/* Clickable Thumbnail Strip */}
              {galleryImages.length > 1 && (
                <div className="d-flex align-items-center gap-2 mt-3 overflow-x-auto pb-1 justify-content-center flex-wrap">
                  {galleryImages.map((thumbUrl, tIdx) => (
                    <button
                      key={tIdx}
                      type="button"
                      onClick={() => setActiveImageIndex(tIdx)}
                      className={`btn p-1 rounded-3 transition-all ${activeImageIndex === tIdx ? 'border border-2 border-warning shadow-sm' : 'border border-light opacity-75'}`}
                      style={{ width: '70px', height: '70px', backgroundColor: '#ffffff' }}
                      title={`عرض صورة ${tIdx + 1}`}
                    >
                      <img
                        src={thumbUrl}
                        alt={`Thumbnail ${tIdx + 1}`}
                        className="rounded-2 w-100 h-100"
                        style={{ objectFit: 'cover' }}
                        onError={(e) => {
                          e.target.onerror = null;
                          e.target.src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=150&q=80';
                        }}
                      />
                    </button>
                  ))}
                </div>
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
                {effectiveInStock ? (
                  <Badge bg="success" className="bg-opacity-10 text-success px-3 py-1.5 rounded-pill border border-success fw-bold d-flex align-items-center gap-1">
                    <CheckCircle2 size={14} /> متوفر بالمعرض
                  </Badge>
                ) : (
                  <Badge bg="danger" className="bg-opacity-10 text-danger px-3 py-1.5 rounded-pill border border-danger fw-bold d-flex align-items-center gap-1">
                    <ShieldAlert size={14} /> غير متوفر حالياً {hasVariants && selectedColor ? `(${selectedColor})` : ''}
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
                          const inStockForThisColor = isColorInStock(colorName);
                          const colorHex = getColorHexFromName(colorName);

                          return (
                            <div
                              key={colorName}
                              title={`${colorName} ${!inStockForThisColor ? '(نفذت الكمية)' : ''}`}
                              onClick={() => handleColorClick(colorName)}
                              className={`color-swatch-luxury ${isSelected ? 'active' : ''} ${!inStockForThisColor ? 'opacity-60 position-relative' : ''}`}
                              style={{
                                backgroundColor: colorHex,
                                border: isSelected ? '2px solid #000' : (!inStockForThisColor ? '2px dashed #dc3545' : '1px solid #e2e8f0')
                              }}
                            >
                              {!inStockForThisColor && (
                                <span className="position-absolute top-50 start-50 translate-middle text-danger fw-black" style={{ fontSize: '10px', pointerEvents: 'none', textShadow: '0 0 2px #fff' }}>✕</span>
                              )}
                            </div>
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
                          const coverInStock = v && v.inStock !== undefined ? v.inStock !== false : true;
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
                              className={`variant-pill-luxury ${isSelected ? 'active' : ''} ${!coverInStock ? 'border-danger text-muted opacity-75' : ''}`}
                            >
                              {coverName} 
                              {!coverInStock && <small className="text-danger ms-1 fw-bold">(نفذ)</small>}
                              {coverInStock && diff !== 0 && <small className={diff > 0 ? 'text-warning' : ''}>{priceBadge}</small>}
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
                  className={effectiveInStock ? "whatsapp-btn-luxury" : "whatsapp-btn-luxury bg-secondary border-secondary"}
                >
                  <MessageCircle size={24} />
                  {effectiveInStock ? "استفسر أو اطلب معاينة عبر الواتساب مباشرة" : "استفسار عن موعد توفر هذا اللون عبر الواتساب"}
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
