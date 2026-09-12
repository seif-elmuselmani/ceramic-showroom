import React from 'react';
import { Card } from 'react-bootstrap';
import { LayoutGrid } from 'lucide-react';

const ProductSkeleton = ({ index = 0 }) => {
  const delayClass = `skeleton-delay-${index % 8}`;

  return (
    <Card className={`h-100 luxury-skeleton-card border-0 ${delayClass}`}>
      {/* 1. Tile Image Skeleton with Showroom Tile Watermark & Badges */}
      <div className="skeleton-img-box skeleton-shimmer">
        <div className="skeleton-watermark-icon" title="جاري تحميل أصناف المعرض...">
          <LayoutGrid size={26} />
        </div>
        
        {/* Top Badges Simulation */}
        <div className="position-absolute top-0 start-0 end-0 p-3 d-flex justify-content-between align-items-center">
          <div className="skeleton-badge skeleton-shimmer" style={{ width: '65px', height: '26px' }}></div>
          <div className="skeleton-badge skeleton-shimmer" style={{ width: '80px', height: '26px' }}></div>
        </div>
      </div>

      {/* 2. Card Content Skeleton */}
      <Card.Body className="p-3 d-flex flex-column bg-white">
        {/* Color Swatches Row Placeholder */}
        <div className="d-flex align-items-center gap-1.5 mb-3">
          <div className="skeleton-dot skeleton-shimmer" style={{ width: '18px', height: '18px' }}></div>
          <div className="skeleton-dot skeleton-shimmer" style={{ width: '18px', height: '18px' }}></div>
          <div className="skeleton-dot skeleton-shimmer" style={{ width: '18px', height: '18px' }}></div>
          <div className="skeleton-text skeleton-shimmer ms-auto" style={{ width: '70px', height: '14px' }}></div>
        </div>

        {/* Brand & Category Pill */}
        <div className="d-flex align-items-center gap-2 mb-2">
          <div className="skeleton-text skeleton-shimmer" style={{ width: '60px', height: '16px' }}></div>
          <div className="skeleton-text skeleton-shimmer" style={{ width: '80px', height: '16px' }}></div>
        </div>

        {/* Product Title (2 lines) */}
        <div className="skeleton-text skeleton-shimmer mb-2" style={{ width: '92%', height: '22px' }}></div>
        <div className="skeleton-text skeleton-shimmer mb-3" style={{ width: '65%', height: '18px' }}></div>

        {/* Dimensions & Grade Tag */}
        <div className="d-flex align-items-center gap-2 mb-3">
          <div className="skeleton-badge skeleton-shimmer" style={{ width: '75px', height: '22px' }}></div>
          <div className="skeleton-badge skeleton-shimmer" style={{ width: '90px', height: '22px' }}></div>
        </div>

        {/* Price & Action Row */}
        <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
          <div>
            <div className="skeleton-text skeleton-shimmer mb-1" style={{ width: '45px', height: '12px' }}></div>
            <div className="skeleton-text skeleton-shimmer" style={{ width: '110px', height: '26px' }}></div>
          </div>
          
          <div className="d-flex align-items-center gap-1.5">
            <div className="skeleton-btn skeleton-shimmer" style={{ width: '38px', height: '38px', borderRadius: '50%' }}></div>
            <div className="skeleton-btn skeleton-shimmer" style={{ width: '42px', height: '38px', borderRadius: '12px' }}></div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );
};

export default ProductSkeleton;
