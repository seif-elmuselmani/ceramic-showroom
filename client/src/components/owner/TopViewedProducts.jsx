import React from 'react';
import { Table, Badge } from 'react-bootstrap';
import { TrendingUp, Eye } from 'lucide-react';

const TopViewedProducts = ({ topViewedProducts }) => {
  return (
    <div className="p-4 rounded-4 shadow-sm bg-white border border-slate-200 h-100">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <h5 className="fw-black text-dark mb-0 d-flex align-items-center gap-2">
          <TrendingUp size={22} className="text-warning" />
          🏆 الأكثر مشاهدة وإقبالاً من الزوار (Top Tile Products):
        </h5>
        <Badge bg="warning" className="text-dark fw-bold fs-7 px-3 py-1.5 rounded-pill">
          تحديث تلقائي
        </Badge>
      </div>

      {topViewedProducts.length === 0 ? (
        <div className="text-center py-4 text-muted fw-bold fs-6">
          <Eye size={36} className="text-warning opacity-50 mb-2 d-block mx-auto" />
          سيظهر هنا الترتيب التلقائي لأكثر بلاطات السيراميك والبورسلين زيارة عند تصفح الزوار للكتالوج.
        </div>
      ) : (
        <Table hover responsive className="align-middle mb-0 border-0">
          <thead className="bg-light fs-7 text-uppercase text-muted">
            <tr>
              <th>الترتيب</th>
              <th>الصورة والصنف</th>
              <th>الفئة والمقاس</th>
              <th className="text-center">السعر</th>
              <th className="text-end">المشاهدات</th>
            </tr>
          </thead>
          <tbody>
            {topViewedProducts.map((prod, idx) => (
              <tr key={prod.id || idx}>
                <td className="fw-black text-center" style={{ width: '40px' }}>
                  <span className={`badge rounded-circle p-2 fs-7 ${idx === 0 ? 'bg-warning text-dark' : idx === 1 ? 'bg-secondary text-white' : idx === 2 ? 'bg-amber text-dark border' : 'bg-light text-dark border'}`}>
                    #{idx + 1}
                  </span>
                </td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img 
                      src={prod.image || 'https://images.unsplash.com/photo-1615873968403-89e068629265?auto=format&fit=crop&w=150&q=80'} 
                      alt={prod.name} 
                      style={{ width: '42px', height: '42px', objectFit: 'cover', borderRadius: '8px' }}
                    />
                    <div>
                      <div className="fw-bold text-dark fs-7 mb-0">{prod.name}</div>
                      <span className="text-muted small">كود: {prod.code || 'بدون كود'}</span>
                    </div>
                  </div>
                </td>
                <td>
                  <span className="badge bg-light text-dark border mb-1 d-block w-fit">{prod.category}</span>
                  <span className="text-muted small">{prod.dimensions || 'قياسي'}</span>
                </td>
                <td className="text-center fw-black text-success fs-7">
                  {prod.price} ج.م
                </td>
                <td className="text-end">
                  <Badge bg="primary" className="px-3 py-1.5 rounded-pill fs-7 fw-bold">
                    {prod.viewsCount} زيارة
                  </Badge>
                </td>
              </tr>
            ))}
          </tbody>
        </Table>
      )}
    </div>
  );
};

export default TopViewedProducts;
