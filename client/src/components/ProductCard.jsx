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

          {/* Interactive Luxury Variant Selectors (Color & Cover Type with Color Dots) */}
          {hasVariants && (
            <div className="variant-selectors-container mb-3 p-2.5 bg-white rounded-3 border border-slate-200 shadow-xs">
              <div className="text-dark fw-bold mb-2 style-variant-label d-flex align-items-center justify-content-between border-bottom pb-1 fs-8">
                <span className="d-flex align-items-center gap-1 text-primary">
                  <span className="pulse-dot-gold"></span>
                  اختر اللون والغطاء المطلوبة:
                </span>
                <span className="badge bg-warning text-dark border border-warning-subtle rounded-pill px-2 py-0.5 fs-8 fw-bold">
                  {product.variants.length} خيارات متاحة
                </span>
              </div>
              <div className="d-flex flex-column gap-1.5">
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
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedVariantIndex(vIdx);
                      }}
                      className={`btn btn-sm w-100 rounded-3 px-2.5 py-1.5 d-flex align-items-center justify-content-between transition-all border ${
                        isSelected 
                          ? 'bg-warning bg-opacity-15 border-warning text-dark shadow-sm fw-bold' 
                          : 'bg-light text-dark border-slate-200 hover-bg-white'
                      }`}
                      style={{ textAlign: 'right' }}
                    >
                      <div className="d-flex align-items-center gap-2 overflow-hidden text-truncate">
                        {/* Color Dot Swatch Indicator */}
                        {variant.color && (
                          <span 
                            className="rounded-circle border border-secondary shadow-xs d-inline-block flex-shrink-0"
                            style={{ 
                              width: '14px', 
                              height: '14px', 
                              backgroundColor: colorHex,
                              boxShadow: isSelected ? '0 0 0 2px #d4af37' : 'none'
                            }}
                          />
                        )}
                        <span className="fs-8 text-truncate">
                          {variant.color || `خيار ${vIdx + 1}`}
                          {variant.coverType ? ` • (${variant.coverType})` : ''}
                        </span>
                      </div>

                      <span className={`fs-8 fw-bold px-2 py-0.5 rounded-pill flex-shrink-0 ms-1 ${
                        isSelected ? 'bg-dark text-warning' : 'bg-white text-dark border'
                      }`}>
                        {vPrice.toLocaleString()} ج.م
                      </span>
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
