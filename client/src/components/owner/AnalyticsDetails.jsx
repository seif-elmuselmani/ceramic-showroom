import React from 'react';
import { Row, Col, Badge, ProgressBar } from 'react-bootstrap';
import { PieChart, Zap, Clock, Sparkles } from 'lucide-react';

const AnalyticsDetails = ({ analyticsData, lastRefreshedTime }) => {
  const totalWaClicks = analyticsData?.whatsappClicks || 1;
  const floatingBadgeCount = analyticsData?.whatsappClickDetails?.floating_badge || 0;
  const productCardCount = analyticsData?.whatsappClickDetails?.product_card || 0;
  const productModalCount = analyticsData?.whatsappClickDetails?.product_modal || 0;
  const tileCalcCount = analyticsData?.whatsappClickDetails?.tile_calculator || 0;

  return (
    <Row className="g-4 mb-4">
      {/* WhatsApp Lead Breakdown */}
      <Col lg={7}>
        <div className="p-4 rounded-4 shadow-sm bg-white border border-slate-200 h-100">
          <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
            <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
              <PieChart size={22} className="text-warning" />
              تفاصيل مصادر نقرات استفسارات الواتساب الحية:
            </h5>
            <Badge bg="warning" className="text-dark fw-bold fs-7 px-3 py-1.5 rounded-pill shadow-sm">
              إجمالي {analyticsData?.whatsappClicks || 0} نقرة
            </Badge>
          </div>

          <div className="d-flex flex-column gap-3">
            {/* Source 1: Floating Badge */}
            <div className="p-3 rounded-3 bg-light border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark d-flex align-items-center gap-2">
                  💬 الشارة العائمة الملكية (استفسار عام)
                </span>
                <Badge bg="warning" className="text-dark fw-bold fs-6 px-3 py-1 rounded-pill">
                  {floatingBadgeCount} نقرة ({Math.round((floatingBadgeCount / (totalWaClicks || 1)) * 100)}%)
                </Badge>
              </div>
              <ProgressBar variant="warning" now={(floatingBadgeCount / (totalWaClicks || 1)) * 100} style={{ height: '8px' }} className="rounded-pill bg-white border" />
            </div>

            {/* Source 2: Product Cards */}
            <div className="p-3 rounded-3 bg-light border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark d-flex align-items-center gap-2">
                  📦 كروت الكتالوج والمنتجات مباشرة
                </span>
                <Badge bg="success" className="fw-bold fs-6 px-3 py-1 rounded-pill">
                  {productCardCount} نقرة ({Math.round((productCardCount / (totalWaClicks || 1)) * 100)}%)
                </Badge>
              </div>
              <ProgressBar variant="success" now={(productCardCount / (totalWaClicks || 1)) * 100} style={{ height: '8px' }} className="rounded-pill bg-white border" />
            </div>

            {/* Source 3: Product Modal */}
            <div className="p-3 rounded-3 bg-light border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark d-flex align-items-center gap-2">
                  👁️ نافذة التفاصيل والمواصفات الكاملة
                </span>
                <Badge bg="info" className="text-dark fw-bold fs-6 px-3 py-1 rounded-pill">
                  {productModalCount} نقرة ({Math.round((productModalCount / (totalWaClicks || 1)) * 100)}%)
                </Badge>
              </div>
              <ProgressBar variant="info" now={(productModalCount / (totalWaClicks || 1)) * 100} style={{ height: '8px' }} className="rounded-pill bg-white border" />
            </div>

            {/* Source 4: Tile Calculator */}
            <div className="p-3 rounded-3 bg-light border">
              <div className="d-flex align-items-center justify-content-between mb-2">
                <span className="fw-bold text-dark d-flex align-items-center gap-2">
                  🧮 حاسبة الكراتين والكميات والقطع الذكية
                </span>
                <Badge bg="primary" className="fw-bold fs-6 px-3 py-1 rounded-pill">
                  {tileCalcCount} مقايسة ({Math.round((tileCalcCount / (totalWaClicks || 1)) * 100)}%)
                </Badge>
              </div>
              <ProgressBar variant="primary" now={(tileCalcCount / (totalWaClicks || 1)) * 100} style={{ height: '8px' }} className="rounded-pill bg-white border" />
            </div>
          </div>
        </div>
      </Col>

      {/* Server Activity Status */}
      <Col lg={5}>
        <div className="p-4 rounded-4 shadow-sm bg-white border border-slate-200 h-100 d-flex flex-column justify-content-between">
          <div>
            <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom">
              <h5 className="fw-bold text-dark mb-0 d-flex align-items-center gap-2">
                <Zap size={22} className="text-warning" />
                حالة الاتصال والسيرفر السحابي:
              </h5>
              <span className="badge bg-success bg-opacity-15 text-success border border-success border-opacity-30 rounded-pill px-3 py-1.5 fw-bold">
                🟢 متصل 100%
              </span>
            </div>

            <div className="p-4 bg-light border border-warning border-opacity-40 rounded-4 text-center mb-4">
              <Clock size={44} className="text-warning mb-3" />
              <div className="text-muted fs-6 mb-1 fw-bold">آخر حركة زائر سجلها خادم Vercel Live:</div>
              <div className="fs-5 fw-black text-dark">
                {analyticsData?.lastActivity ? new Date(analyticsData.lastActivity).toLocaleString('ar-EG') : 'الآن'}
              </div>
              <div className="mt-3 text-muted small fw-semibold">
                تحديث الشاشة الأخير: {lastRefreshedTime.toLocaleTimeString('ar-EG')}
              </div>
            </div>
          </div>

          <div className="p-3 bg-warning bg-opacity-15 border border-warning rounded-3 text-dark small text-center fw-bold">
            <Sparkles size={16} className="me-1 text-warning" /> جميع الأرقام والبيانات محمية وحصرية لمالك المشروع وتتحدث تلقائياً.
          </div>
        </div>
      </Col>
    </Row>
  );
};

export default AnalyticsDetails;
