import React from 'react';
import { Button } from 'react-bootstrap';
import { MessageCircle, Eye, Calculator, Share2 } from 'lucide-react';

const ProductCard = ({ product, onSelectProduct, onOpenCalculator, settings }) => {
  const whatsappNumber = settings?.whatsappNumber || '201012345678';
  
  const messageText = `مرحباً، أستفسر عن صنف السيراميك/البورسلين: ${product.name} (كود: ${product.code}) - السعر: ${product.price} ج.م. هل هو متوفر المعرض حالياً؟`;
  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(messageText)}`;

  const handleShare = async (e) => {
    e.preventDefault();
    const shareUrl = `${window.location.origin}${window.location.pathname}?product=${product.id}`;
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
    <div className="ceramic-card">
      <div className="card-img-wrapper">
        <img 
          src={product.image || 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80'} 
          alt={product.name} 
          onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=600&q=80'; }}
        />
        <div className="card-badge">{product.category}</div>
        
        {product.inStock ? (
          <span className="stock-badge bg-success text-white">متوفر بالمخزن</span>
        ) : (
          <span className="stock-badge bg-danger text-white">غير متوفر حالياً</span>
        )}

        {product.featured && (
          <span style={{ position: 'absolute', bottom: '8px', right: '8px', background: '#d97706', color: '#fff', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '8px', fontWeight: 'bold' }}>
            🔥 صنف مميز
          </span>
        )}
      </div>

      <div className="card-body-luxury">
        <h5 className="card-title-luxury">{product.name}</h5>
        <div className="card-code-luxury">كود الصنف: <span>{product.code}</span></div>
        
        <div className="card-specs-row mb-3">
          {product.dimensions && <span className="spec-pill">📐 {product.dimensions} سم</span>}
          {product.origin && <span className="spec-pill">🌍 {product.origin}</span>}
          {product.finish && <span className="spec-pill">✨ {product.finish}</span>}
        </div>

        <div className="card-footer-luxury">
          <div className="price-tag-luxury">
            <span className="price-num">{product.price}</span>
            <span className="price-currency">ج.م / {product.priceUnit || 'م2'}</span>
          </div>

          <div className="d-flex gap-2 mb-2">
            <Button 
              className="btn-details flex-grow-1 d-flex align-items-center justify-content-center gap-1"
              onClick={() => onSelectProduct(product)}
            >
              <Eye size={15} />
              التفاصيل
            </Button>

            <Button 
              variant="outline-warning"
              className="btn-details flex-grow-1 d-flex align-items-center justify-content-center gap-1 fw-bold text-dark border-warning"
              onClick={() => onOpenCalculator(product)}
              title="احسب الأمتار والكراتين"
            >
              <Calculator size={15} />
              احسب الأمتار
            </Button>
          </div>

          <div className="d-flex gap-2">
            <a 
              href={whatsappUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="btn-whatsapp flex-grow-1"
              title="تواصل مباشر عبر الواتساب"
            >
              <MessageCircle size={18} />
              تواصل عبر الواتساب
            </a>
            
            <Button
              variant="outline-secondary"
              onClick={handleShare}
              className="d-flex align-items-center justify-content-center px-3"
              style={{ minHeight: '44px', border: '1px solid #cbd5e1' }}
              title="مشاركة الصنف"
            >
              <Share2 size={18} className="text-secondary" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
