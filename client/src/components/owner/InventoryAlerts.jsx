import React from 'react';
import { Badge, Button } from 'react-bootstrap';
import { PackageX, CheckCircle2 } from 'lucide-react';

const InventoryAlerts = ({ outOfStockProducts, handleRestockProduct }) => {
  return (
    <div className="p-4 rounded-4 shadow-sm bg-white border border-slate-200 flex-grow-1">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2 fs-6">
          <PackageX size={20} className="text-danger" />
          🚨 النواقص بالمخزن (Out of Stock):
        </h5>
        <Badge bg={outOfStockProducts.length > 0 ? "danger" : "success"} className="fw-bold px-2.5 py-1 rounded-pill small">
          {outOfStockProducts.length} صنف
        </Badge>
      </div>

      {outOfStockProducts.length === 0 ? (
        <div className="p-3 rounded-3 bg-success bg-opacity-10 text-success fw-bold text-center small">
          <CheckCircle2 size={18} className="me-1" /> كافة أصناف المعرض متوفرة حالياً بالمخزن بنسبة 100%!
        </div>
      ) : (
        <div className="d-flex flex-column gap-2 max-h-200 overflow-y-auto">
          {outOfStockProducts.map(prod => (
            <div key={prod.id} className="p-2.5 rounded-3 bg-light border d-flex align-items-center justify-content-between gap-2">
              <div>
                <div className="fw-bold text-dark fs-7">{prod.name}</div>
                <span className="text-muted small">كود: {prod.code || 'بدون كود'} | {prod.category}</span>
              </div>
              <Button 
                variant="success" 
                size="sm" 
                onClick={() => handleRestockProduct(prod.id)}
                className="rounded-pill fw-bold text-nowrap fs-7 px-3 py-1"
              >
                إعادة توفر 🟢
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default InventoryAlerts;
