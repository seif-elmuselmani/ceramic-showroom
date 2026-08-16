import React from 'react';
import { Button } from 'react-bootstrap';
import { MessageCircle, Eye } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';

const ProductCard = ({ product, onSelectProduct, onOpenCalculator, settings, onSelectBrand }) => {
  if (!product) return null;

  const [selectedVariantIndex, setSelectedVariantIndex] = React.useState(0);

  const hasVariants = Boolean(product.hasVariants && Array.isArray(product.variants) && product.variants.length > 0);
  const activeVariant = hasVariants ? (product.variants[selectedVariantIndex] || product.variants[0]) : null;

  const effectivePrice = activeVariant && activeVariant.price !== undefined ? Number(activeVariant.price) : Number(product.price);
  const effectiveOriginalPrice = activeVariant && activeVariant.originalPrice !== undefined ? Number(activeVariant.originalPrice) : Number(product.originalPrice);
  const effectiveCode = activeVariant && activeVariant.code ? activeVariant.code : product.code;
  const effectiveImage = activeVariant && activeVariant.image ? activeVariant.image : product.image;
  const effectiveColor = activeVariant && activeVariant.color ? activeVariant.color : product.color;
  const effectiveCoverType = activeVariant && activeVariant.coverType ? activeVariant.coverType : product.coverType;

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

          {/* Interactive Product Variant Selectors (Color & Cover Type) */}
          {hasVariants && (
            <div className="variant-selectors-container mb-3 p-2 bg-light rounded-3 border">
              <div className="text-dark fw-bold mb-1.5 style-variant-label d-flex align-items-center justify-content-between">
                <span>🎨 الخيارات المتاحة:</span>
                <span className="badge bg-warning bg-opacity-20 text-dark border border-warning border-opacity-30 rounded-pill">
                  {product.variants.length} خيارات
                </span>
              </div>
              <div className="d-flex flex-wrap gap-1">
                {product.variants.map((variant, vIdx) => {
                  const isSelected = selectedVariantIndex === vIdx;
                  const labelParts = [];
                  if (variant.color) labelParts.push(variant.color);
                  if (variant.coverType) labelParts.push(variant.coverType);
                  const labelText = labelParts.join(' - ') || `خيار ${vIdx + 1}`;

                  return (
                    <button
                      key={variant.id || vIdx}
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariantIndex(vIdx);
                      }}
                      className={`btn btn-sm rounded-pill px-2.5 py-1 text-nowrap fw-bold fs-8 transition-all ${
                        isSelected 
                          ? 'btn-primary text-white shadow-sm border-primary' 
                          : 'btn-outline-secondary bg-white text-dark border-secondary border-opacity-25'
                      }`}
                    >
                      {isSelected ? '✓ ' : ''}{labelText}
                    </button>
                  );
                })}
              </div>
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
