import React from 'react';
import { Badge } from 'react-bootstrap';
import { Search } from 'lucide-react';

const PopularKeywords = ({ sortedSearchQueries }) => {
  return (
    <div className="p-4 rounded-4 shadow-sm bg-white border border-slate-200">
      <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
        <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2 fs-6">
          <Search size={20} className="text-primary" />
          🔍 الكلمات الأكثر بحثاً من الزباين:
        </h5>
        <span className="badge bg-primary bg-opacity-15 text-primary fw-bold px-2.5 py-1 rounded-pill small">
          اهتمامات الزوار
        </span>
      </div>

      {sortedSearchQueries.length === 0 ? (
        <p className="text-muted small mb-0 text-center py-2 fw-semibold">
          ستسجل هنا أكثر ألمع كلمات البحث (مثل: إسباني، باركيه، كليوباترا) عندما يبحث عنها الزوار.
        </p>
      ) : (
        <div className="d-flex flex-wrap gap-2">
          {sortedSearchQueries.map(({ query, count }, i) => (
            <span key={i} className="badge bg-light text-dark border p-2 rounded-3 fs-7 fw-bold d-inline-flex align-items-center gap-2">
              <span>{query}</span>
              <Badge bg="dark" className="rounded-pill px-2 py-0.5 small">{count}</Badge>
            </span>
          ))}
        </div>
      )}
    </div>
  );
};

export default PopularKeywords;
