import React from 'react';
import { Card } from 'react-bootstrap';

const ProductSkeleton = () => {
  return (
    <Card className="h-100 product-card border-0 shadow-sm rounded-4 overflow-hidden" style={{ animation: 'pulse 1.5s infinite ease-in-out' }}>
      <div 
        className="bg-secondary bg-opacity-25" 
        style={{ height: '280px', width: '100%' }}
      ></div>
      <Card.Body className="p-4 d-flex flex-column bg-white">
        <div className="d-flex justify-content-between align-items-center mb-3">
          <div className="bg-secondary bg-opacity-25 rounded-pill" style={{ height: '24px', width: '80px' }}></div>
          <div className="bg-secondary bg-opacity-25 rounded-pill" style={{ height: '24px', width: '60px' }}></div>
        </div>
        
        <div className="bg-secondary bg-opacity-25 rounded mb-2" style={{ height: '20px', width: '100%' }}></div>
        <div className="bg-secondary bg-opacity-25 rounded mb-4" style={{ height: '20px', width: '70%' }}></div>
        
        <div className="mt-auto pt-3 border-top d-flex justify-content-between align-items-center">
          <div className="bg-secondary bg-opacity-25 rounded" style={{ height: '28px', width: '100px' }}></div>
          <div className="bg-secondary bg-opacity-25 rounded-circle" style={{ height: '40px', width: '40px' }}></div>
        </div>
      </Card.Body>
      <style jsx="true">{`
        @keyframes pulse {
          0% { opacity: 0.6; }
          50% { opacity: 1; }
          100% { opacity: 0.6; }
        }
      `}</style>
    </Card>
  );
};

export default ProductSkeleton;
