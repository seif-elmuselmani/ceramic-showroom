import React from 'react';
import { Button } from 'react-bootstrap';
import { MessageCircle, Eye } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';

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
  const messageText = `السلام عليكم ورحمة الله وبركاته 💐
أود الاستفسار وحجز معاينة صنف من معرضكم العامر:

📦 اسم الصنف: ${product.name}
🏷️ كود الصنف: ${effectiveCode || 'غير محدد'}
📂 الفئة: ${product.category}${product.subcategory ? ` (${product.subcategory})` : ''}
${effectiveColor ? `🎨 اللون المختار: ${effectiveColor}\n` : ''}${effectiveCoverType ? `🚽 نوع الغطاء: ${effectiveCoverType}\n` : ''}📐 المقاس: ${product.dimensions || 'قياسي'}
✨ السطح: ${product.finish || 'ممتاز'}
💰 السعر: ${effectivePrice} ج.م / ${product.priceUnit || 'متر مربع'}${hasDiscount ? ` (خصم ${discountPercent}% - توفير ${savingsAmount} ج.م)` : ''}

🔗 رابط الصنف المباشر:
${productLink}

هل الصنف متوفر في المعرض حالياً لمعاينة العينة؟ 🙏✨`;
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

  return (
    <div className={`ceramic-card position-relative ${hasDiscount ? 'on-sale-card' : ''}`}>
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

      <div className="card-body-luxury d-flex flex-column p-3">
        <div>
          <div className="d-flex align-items-center justify-content-between mb-1">
            {product.brand ? (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  if (onSelectBrand) onSelectBrand(product.brand);
                }}
                className="badge-brand-gold-link btn btn-link p-0 text-decoration-none"
                title={`استعرض جميع أصناف ماركة ${product.brand}`}
              >
                🏷️ {product.brand}
              </button>
            ) : (
              <span className="badge bg-light text-muted border">عام</span>
            )}
            <span className="text-muted small fw-semibold">كود: {effectiveCode}</span>
          </div>

          <h5 className="card-title-luxury text-truncate mb-2" title={product.name}>{product.name}</h5>

          {hasVariants && (
            <div className="d-flex align-items-center justify-content-between mb-2.5 pt-1 border-top border-light">
              {availableColors.length > 0 && (
                <div className="d-flex align-items-center gap-1.5">
                  <span className="text-muted fs-8 fw-semibold me-1">🎨 اللون:</span>
                  <div className="d-flex align-items-center gap-1.5">
                    {availableColors.map((colorName) => {
                      const isSelected = selectedColor === colorName;
                      const variantForColor = product.variants.find(v => (v.color || '').trim() === colorName);
                      const swatchImage = variantForColor?.image;
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
                          onClick={(e) => {
                            e.stopPropagation();
                            handleColorClick(colorName);
                          }}
                          title={`اللون: ${colorName}`}
                          className="rounded-circle border p-0 cursor-pointer transition-all d-inline-block flex-shrink-0"
                          style={{
                            width: '20px',
                            height: '20px',
                            backgroundColor: swatchImage ? 'transparent' : colorHex,
                            backgroundImage: swatchImage ? `url(${swatchImage})` : 'none',
                            backgroundSize: 'cover',
                            backgroundPosition: 'center',
                            border: isSelected ? '2px solid #0f172a' : '1px solid #cbd5e1',
                            boxShadow: isSelected ? '0 0 0 2px #d4af37' : 'none',
                            transform: isSelected ? 'scale(1.15)' : 'scale(1)'
                          }}
                        />
                      );
                    })}
                  </div>
                </div>
              )}

              {availableCoverTypes.length > 0 && (
                <span className="badge bg-light text-secondary border rounded-pill fs-8 fw-normal text-truncate ms-auto" style={{ maxWidth: '140px' }} title={selectedCoverType}>
                  🚽 {selectedCoverType}
                </span>
              )}
            </div>
          )}

          {/* Dynamic Minimalist Specs Line */}
          {specsList.length > 0 && (
            <div className="minimal-specs-line text-muted small mb-3 text-truncate">
              {specsList.join('  •  ')}
            </div>
          )}
        </div>

        <div className="card-footer-luxury mt-auto pt-2 border-top">
          {/* Price & Offer Block matching Client Screenshot */}
          <div className="price-tag-luxury mb-2">
            <div className="d-flex align-items-center gap-2 flex-wrap mb-1">
              <span className="fs-3 fw-black text-dark">{(Number(product.price) || 0).toLocaleString()}</span>
              <span className="small fw-bold text-muted">ج.م / {product.priceUnit || 'م2'}</span>
              
              {hasDiscount && (
                <del className="text-muted small text-decoration-line-through me-1">
                  {(Number(product.originalPrice) || 0).toLocaleString()} ج.م
                </del>
              )}

              {hasDiscount && (
                <span className="badge-pink-discount">-{discountPercent}%</span>
              )}
            </div>

            {hasDiscount && (
              <div className="d-flex align-items-center gap-2 mt-1.5 flex-wrap">
                <span className="pill-savings-green">
                  وفرت {(Number(savingsAmount) || 0).toLocaleString()} جنيه
                </span>
                {durationText && (
                  <span className="pill-duration-yellow">
                    ⏰ {durationText}
                  </span>
                )}
              </div>
            )}
          </div>

          {/* Minimal 2 Action Buttons */}
          <div className="d-flex gap-2 align-items-center">
            <Button 
              variant="outline-dark"
              className="btn-details-minimal flex-grow-1 flex-shrink-0 text-nowrap d-flex align-items-center justify-content-center gap-1.5 rounded-3 px-2.5 fw-bold"
              onClick={() => onSelectProduct(product)}
              title="عرض التفاصيل والحساب"
              style={{ minHeight: '44px' }}
            >
              <Eye size={16} className="flex-shrink-0" />
              <span>التفاصيل</span>
            </Button>

            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp flex-grow-1 text-nowrap d-flex align-items-center justify-content-center gap-1.5 rounded-3 text-white fw-bold text-decoration-none px-2"
              title="تواصل مباشر عبر الواتساب"
              style={{ minHeight: '44px' }}
            >
              <MessageCircle size={18} className="flex-shrink-0" />
              <span className="btn-wa-text">تواصل واتساب</span>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
