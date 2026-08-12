import React from 'react';
import { Button } from 'react-bootstrap';
import { MessageCircle, Eye } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';

const ProductCard = ({ product, onSelectProduct, onOpenCalculator, settings }) => {
  if (!product) return null;

  const whatsappNumber = settings?.whatsappNumber || '201012345678';
  
  const productLink = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;
  const messageText = `مرحباً، أستفسر عن صنف السيراميك/البورسلين:\n- الاسم: ${product.name}\n- الكود: ${product.code}\n- السعر: ${product.price} ج.م / ${product.priceUnit || 'م2'}\n- رابط الصنف: ${productLink}\n\nهل الصنف متوفر في المعرض حالياً؟`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  const [copiedToast, setCopiedToast] = React.useState(false);

  const handleShare = async (e) => {
    e.preventDefault();
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
        setCopiedToast(true);
        setTimeout(() => setCopiedToast(false), 3200);
      }
    } catch (err) {
      console.error('Error sharing:', err);
    }
  };

  const { hasDiscount, discountPercent, savingsAmount, durationText } = getProductDiscount(product);

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

      <div className="card-img-wrapper position-relative">
        <img 
          src={
            product.image 
              ? (product.image.includes('images.unsplash.com') && !product.image.includes('w=') 
                  ? `${product.image}&auto=format&fit=crop&w=500&q=75` 
                  : product.image)
              : 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=500&q=75'
          } 
          alt={product.name} 
          loading="lazy"
          decoding="async"
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=500&q=75'; }}
        />
        
        {/* Category Badge Top-Right */}
        <div className="card-badge">{product.category}</div>
        
        {/* Glowing Discount Badge Ribbon Top-Left */}
        {hasDiscount && (
          <div className="discount-ribbon-tag shadow-sm">
            <span className="ribbon-fire">🔥</span>
            <span>خصم {discountPercent}%</span>
          </div>
        )}
      </div>

      <div className="card-body-luxury d-flex flex-column justify-content-between p-3">
        <div>
          <h5 className="card-title-luxury text-truncate mb-2" title={product.name}>{product.name}</h5>
          
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
              <span className="fs-3 fw-black text-dark">{product.price.toLocaleString()}</span>
              <span className="small fw-bold text-muted">ج.م / {product.priceUnit || 'م2'}</span>
              
              {hasDiscount && (
                <del className="text-muted small text-decoration-line-through me-1">
                  {product.originalPrice.toLocaleString()} ج.م
                </del>
              )}

              {hasDiscount && (
                <span className="badge-pink-discount">-{discountPercent}%</span>
              )}
            </div>

            {hasDiscount && (
              <div className="d-flex align-items-center gap-2 mt-1.5 flex-wrap">
                <span className="pill-savings-green">
                  وفرت {savingsAmount.toLocaleString()} جنيه
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
