import React from 'react';
import { Row, Col, ProgressBar } from 'react-bootstrap';
import { Users, Clock, MousePointerClick, Smartphone, Eye } from 'lucide-react';

const StatsCards = ({ analyticsData }) => {
  const totalDeviceVisits = (analyticsData?.mobileCount || 0) + (analyticsData?.desktopCount || 0) || 1;
  const mobilePercent = Math.round(((analyticsData?.mobileCount || 0) / totalDeviceVisits) * 100);
  const desktopPercent = 100 - mobilePercent;

  return (
    <Row className="g-4 mb-4">
      <Col xs={12} sm={6} lg={3}>
        <div className="p-4 rounded-4 shadow-sm bg-white border border-warning border-opacity-50 h-100">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-dark fw-bold small text-uppercase">👥 إجمالي زوار المعرض</span>
            <div className="p-2 rounded-3 bg-warning bg-opacity-15 text-dark fw-bold">
              <Users size={24} className="text-warning" />
            </div>
          </div>
          <div className="fs-1 fw-black text-dark mb-1">{(analyticsData?.totalVisitors || 0).toLocaleString()}</div>
          <div className="d-flex align-items-center gap-1 text-muted small fw-semibold">
            <Eye size={15} className="text-warning" />
            <span>({(analyticsData?.totalPageViews || 0).toLocaleString()} مشاهدة صفحة)</span>
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6} lg={3}>
        <div className="p-4 rounded-4 shadow-sm bg-white border border-success border-opacity-50 h-100">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-dark fw-bold small text-uppercase">⏱️ وقت التصفح الإجمالي</span>
            <div className="p-2 rounded-3 bg-success bg-opacity-15 text-success">
              <Clock size={24} />
            </div>
          </div>
          <div className="fs-1 fw-black text-success mb-1">
            {Math.round((analyticsData?.totalTimeSpentSeconds || 0) / 60).toLocaleString()} <span className="fs-5 fw-bold text-dark">دقيقة</span>
          </div>
          <div className="text-muted small fw-semibold">
            (~{(Math.round((analyticsData?.totalTimeSpentSeconds || 0) / 3600 * 10) / 10)} ساعة تصفح إجمالية)
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6} lg={3}>
        <div className="p-4 rounded-4 shadow-sm bg-white border border-primary border-opacity-50 h-100">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-dark fw-bold small text-uppercase">💬 استفسارات الواتساب</span>
            <div className="p-2 rounded-3 bg-primary bg-opacity-15 text-primary">
              <MousePointerClick size={24} />
            </div>
          </div>
          <div className="fs-1 fw-black text-primary mb-1">{(analyticsData?.whatsappClicks || 0).toLocaleString()} <span className="fs-5 fw-bold text-dark">نقرة</span></div>
          <div className="text-muted small fw-semibold">
            (عملاء تواصلوا حياً عبر الواتس)
          </div>
        </div>
      </Col>

      <Col xs={12} sm={6} lg={3}>
        <div className="p-4 rounded-4 shadow-sm bg-white border border-info border-opacity-50 h-100">
          <div className="d-flex align-items-center justify-content-between mb-3">
            <span className="text-dark fw-bold small text-uppercase">📱 توزيع الأجهزة</span>
            <div className="p-2 rounded-3 bg-info bg-opacity-15 text-info">
              <Smartphone size={24} />
            </div>
          </div>
          <div className="d-flex align-items-center justify-content-between mb-2">
            <div>
              <span className="small text-muted d-block fw-bold">📱 موبايل:</span>
              <strong className="fs-4 text-dark font-black">{(analyticsData?.mobileCount || 0)}</strong>
            </div>
            <div className="text-end border-start border-slate-200 ps-3">
              <span className="small text-muted d-block fw-bold">💻 كمبيوتر:</span>
              <strong className="fs-4 text-dark font-black">{(analyticsData?.desktopCount || 0)}</strong>
            </div>
          </div>
          <ProgressBar style={{ height: '8px' }} className="rounded-pill bg-light border">
            <ProgressBar variant="warning" now={mobilePercent} key={1} />
            <ProgressBar variant="info" now={desktopPercent} key={2} />
          </ProgressBar>
        </div>
      </Col>
    </Row>
  );
};

export default StatsCards;
