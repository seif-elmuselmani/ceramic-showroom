import React from 'react';
import { Button } from 'react-bootstrap';
import { MessageCircle, Eye } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';
import { getColorHexFromName } from '../utils/colorMapper';

const ProductCard = ({ product, onSelectProduct, onOpenCalculator, settings, onSelectBrand }) => {
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

  const whatsappNumber = settings?.whatsappNumber || '201012345678';
  
  const productLink = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;
  const messageText = `السلام عليكم، أود الاستفسار وحجز الصنف التالي:\n\n📦 ${product.name}\n🏷️ الكود: ${effectiveCode || 'غير محدد'}\n\n🔗 الرابط:\n${productLink}\n\nهل الصنف متوفر في المعرض حالياً؟`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  const [copiedToast, setCopiedToast] = React.useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
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
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 3200);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  // Clean origin & finish for card snippet safely
  const cleanOrigin = typeof product.origin === 'string' ? product.origin.split(' ')[0].replace(/[\(\)]/g, '') : String(product.origin || '');
  const cleanFinish = typeof product.finish === 'string' ? product.finish.split('/')[0].trim() : String(product.finish || '');

  const specsList = [];
  if (product.dimensions) specsList.push(`📐 ${product.dimensions}`);
  if (cleanOrigin) specsList.push(`🌍 ${cleanOrigin}`);
  if (cleanFinish) specsList.push(`✨ ${cleanFinish}`);

  const selectedVariantIndex = React.useMemo(() => {
    if (!hasVariants) return 0;
    return product.variants.findIndex(v => v === activeVariant);
  }, [hasVariants, product.variants, activeVariant]);

  return (
    <div className={`ceramic-card position-relative shadow-sm rounded-4 border-0 h-100 d-flex flex-column transition-all ${hasDiscount ? 'on-sale-card' : ''}`}>
      {copiedToast && (
        <div 
          className="position-absolute top-0 start-50 translate-middle-x mt-2 px-3 py-1.5 rounded-pill shadow-lg text-white small fw-bold d-flex align-items-center gap-1 border border-warning"
          style={{ zIndex: 10, background: '#0f172a', fontSize: '0.8rem' }}
        >
          <span>📋</span> تم نسخ رابط الصنف بنجاح!
        </div>
      )}

      {/* Main Product Image Container with Badges */}
      <div 
        className="card-img-wrapper cursor-pointer"
        onClick={() => onSelectProduct({ ...product, activeVariantIndex: selectedVariantIndex })}
      >
        <img 
          src={effectiveImage || product.image || 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80'} 
          alt={product.name}
          className="card-img-top-luxury"
          loading="lazy"
          referrerPolicy="no-referrer"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80';
          }}
        />

        {/* Floating Badges */}
        <div className="card-floating-badges">
          {hasDiscount && (
            <span className="badge-luxury-gold shadow-sm animate-pulse">
              🔥 خصم {discountPercent}%
            </span>
          )}
          {product.featured && (
            <span className="badge-luxury-dark shadow-sm">
              ⭐ مميز
            </span>
          )}
        </div>
      </div>

      <div className="card-body-luxury d-flex flex-column p-3 pt-3 flex-grow-1">
        <div className="d-flex flex-column flex-grow-1">
          <div className="d-flex align-items-center justify-content-between mb-2">
            {product.brand ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectBrand) onSelectBrand(product.brand);
                }}
                className="btn btn-link p-0 text-decoration-none text-primary fw-bold"
                title={`استعرض جميع أصناف ماركة ${product.brand}`}
                style={{ fontSize: '0.8rem' }}
              >
                {product.brand}
              </button>
            ) : (
              <span className="badge bg-light text-muted border fw-normal" style={{ fontSize: '0.75rem' }}>عام</span>
            )}
            <span className="text-muted fw-semibold" style={{ fontSize: '0.75rem', backgroundColor: '#f8fafc', padding: '2px 6px', borderRadius: '4px' }}>
              كود: {effectiveCode}
            </span>
          </div>

          <h5 
            className="card-title-luxury mb-2 text-dark fw-bold" 
            style={{ 
              display: '-webkit-box', 
              WebkitLineClamp: 2, 
              WebkitBoxOrient: 'vertical', 
              overflow: 'hidden',
              minHeight: '2.6rem',
              lineHeight: '1.3',
              fontSize: '1rem'
            }} 
            title={product.name}
          >
            {product.name}
          </h5>

          {/* Dynamic Minimalist Specs Line */}
          {specsList.length > 0 && (
            <div className="d-flex flex-wrap gap-1 mb-2">
              {specsList.map(spec => (
                <span key={spec} className="badge bg-light text-secondary border border-light fw-normal rounded-1" style={{ fontSize: '0.75rem' }}>
                  {spec}
                </span>
              ))}
            </div>
          )}

          {hasVariants && (
            <div className="d-flex flex-column gap-2 mb-2 mt-auto pt-2 border-top border-light">
              {availableColors.length > 0 && (
                <div className="d-flex align-items-center gap-2">
                  <span className="text-muted fw-semibold flex-shrink-0" style={{ fontSize: '0.75rem' }}>🎨 اللون:</span>
                  <div className="d-flex align-items-center flex-wrap gap-1">
                    {availableColors.map((colorName) => {
                      const isSelected = selectedColor === colorName;
                      const variantForColor = product.variants.find(v => (v.color || '').trim() === colorName);
                      const colorHex = getColorHexFromName(colorName);

                      return (
                        <button
                          key={colorName}
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorClick(colorName);
                          }}
                          title={`اللون: ${colorName}`}
                          className="rounded-circle border p-0 cursor-pointer transition-all d-inline-block flex-shrink-0"
                          style={{
                            width: '22px',
                            height: '22px',
                            backgroundColor: colorHex,
                            border: isSelected ? '2px solid #0f172a' : '1px solid #cbd5e1',
                            boxShadow: isSelected ? '0 0 0 2px #d4af37' : 'none',
                            transform: isSelected ? 'scale(1.1)' : 'scale(1)'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {availableCoverTypes.length > 0 && (
                <div className="d-flex align-items-center gap-2 mt-1">
                  <span className="text-muted fw-semibold flex-shrink-0" style={{ fontSize: '0.75rem' }}>🚽 الغطاء:</span>
                  <div className="d-flex flex-wrap gap-1">
                    {availableCoverTypes.map(cover => (
                      <button
                        key={cover}
                        onClick={(e) => { e.stopPropagation(); handleCoverClick(cover); }}
                        className={`badge ${selectedCoverType === cover ? 'bg-dark text-white border-dark' : 'bg-light text-secondary border-secondary'} border cursor-pointer px-2 py-1 fw-normal rounded-pill`}
                        style={{ fontSize: '0.7rem' }}
                      >
                        {cover}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="card-footer-luxury mt-auto pt-3 border-top border-light">
          {/* Price & Offer Block matching Client Screenshot */}
          <div className="price-tag-luxury mb-3">
            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
              <span className="fs-4 fw-black text-dark">{(Number(effectivePrice) || 0).toLocaleString()}</span>
              <span className="small fw-bold text-muted" style={{ fontSize: '0.8rem' }}>ج.م / {product.priceUnit || 'م2'}</span>
              
              {hasDiscount && (
                <div className="d-flex align-items-center gap-2 ms-auto">
                  <del className="text-muted text-decoration-line-through" style={{ fontSize: '0.8rem' }}>
                    {(Number(effectiveOriginalPrice) || 0).toLocaleString()}
                  </del>
                  <span className="badge bg-danger rounded-pill px-2 fw-bold" style={{ fontSize: '0.75rem' }}>-{discountPercent}%</span>
                </div>
              )}
            </div>

            {hasDiscount && (
              <div className="d-flex align-items-center gap-2 mt-2 flex-wrap">
                <span className="badge bg-success-subtle text-success border border-success-subtle rounded-1 fw-semibold px-2 py-1" style={{ fontSize: '0.75rem' }}>
                  وفرت {(Number(savingsAmount) || 0).toLocaleString()} جنيه
                </span>
                {durationText && (
                  <span className="badge bg-warning-subtle text-warning-emphasis border border-warning-subtle rounded-1 fw-semibold px-2 py-1" style={{ fontSize: '0.75rem' }}>
                    ⏰ {durationText}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Minimal 2 Action Buttons */}
          <div className="d-flex gap-2 align-items-center">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn btn-success flex-grow-1 text-nowrap d-flex align-items-center justify-content-center gap-2 rounded-3 text-white fw-bold shadow-sm"
              title="تواصل مباشر عبر الواتساب"
              style={{ minHeight: '44px' }}
            >
              <MessageCircle size={18} />
              <span style={{ fontSize: '0.9rem' }}>تواصل واتساب</span>
            </a>

            <Button 
              variant="light"
              className="btn-details-minimal text-nowrap d-flex align-items-center justify-content-center gap-2 rounded-3 fw-bold border shadow-sm"
              onClick={() => onSelectProduct({ ...product, activeVariantIndex: selectedVariantIndex })}
              title="عرض التفاصيل والحساب"
              style={{ minHeight: '44px', width: '44px', padding: '0' }}
            >
              <Eye size={18} className="text-dark" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
