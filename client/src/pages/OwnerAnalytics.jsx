import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { BarChart3, Clock, Users, MousePointerClick, Smartphone, RefreshCw, ShieldCheck, Lock } from 'lucide-react';
import axios from 'axios';

const OwnerAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);

  const queryParams = new URLSearchParams(window.location.search);
  const secretKey = queryParams.get('secret') || 'elgazar_owner_super_secret_backup_2026';

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/api/analytics/stats?secret=${encodeURIComponent(secretKey)}`);
      setAnalyticsData(res.data);
    } catch (err) {
      console.error('Failed fetching owner analytics:', err);
      setError('عذراً، الرابط السري غير صالح أو انتهت صلاحية الجلسة.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();

    let timer = null;
    if (autoRefresh) {
      timer = setInterval(() => {
        fetchAnalytics();
      }, 10000); // Auto-refresh every 10 seconds
    }
    return () => {
      if (timer) clearInterval(timer);
    };
  }, [autoRefresh]);

  const handleResetAnalytics = async () => {
    if (window.confirm('🚨 هل أنت تأكد كمالك للمشروع من تصفير جميع إحصائيات الزوار ونقرات الواتساب والبدء من الصفر (0)؟')) {
      try {
        const res = await axios.post(`/api/analytics/reset?secret=${encodeURIComponent(secretKey)}`);
        setAnalyticsData(res.data.analytics);
        setSuccessMsg('تم تصفير جميع الإحصائيات والبدء من الصفر (0) بنجاح!');
        setTimeout(() => setSuccessMsg(''), 4000);
      } catch (err) {
        console.error('Reset analytics error:', err);
        alert('حدث خطأ أثناء تصفير الإحصائيات');
      }
    }
  };

  return (
    <div className="py-5 bg-dark min-vh-100 text-white">
      <Container>
        {/* Header */}
        <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-3 mb-4 pb-3 border-bottom border-warning">
          <div>
            <div className="d-flex align-items-center gap-2 mb-1">
              <Badge bg="warning" className="text-dark fw-bold px-3 py-1.5 rounded-pill fs-7 d-inline-flex align-items-center gap-1">
                <Lock size={14} /> خاص جداً بمالك المشروع حصرياً
              </Badge>
              <Badge bg="success" className="px-2.5 py-1 rounded-pill small d-inline-flex align-items-center gap-1">
                <ShieldCheck size={14} /> مشفر ومدعوم بخادم Vercel Live
              </Badge>
            </div>
            <h2 className="fw-bold text-warning mb-1 d-flex align-items-center gap-2">
              <BarChart3 size={32} />
              لوحة الإحصائيات والتحليلات السرية المباشرة (Owner Dashboard)
            </h2>
            <p className="text-light opacity-75 small mb-0">متابعة لحظية ومستمرة لعدد الزوار الحقيقيين، دقائق التصفح، ونقرات رسائل الواتساب</p>
          </div>

          <div className="d-flex align-items-center gap-2">
            <Button 
              variant={autoRefresh ? "warning" : "outline-light"} 
              size="sm" 
              onClick={() => setAutoRefresh(!autoRefresh)}
              className="rounded-pill fw-bold text-nowrap"
            >
              {autoRefresh ? '🟢 التحديث التلقائي نشط (كل 10ث)' : '⏸️ التحديث التلقائي متوقف'}
            </Button>

            <Button 
              variant="outline-warning" 
              size="sm" 
              onClick={fetchAnalytics}
              className="rounded-pill fw-bold"
            >
              <RefreshCw size={14} className="me-1" /> تحديث الآن
            </Button>

            <Button 
              variant="outline-danger" 
              size="sm" 
              onClick={handleResetAnalytics}
              className="rounded-pill fw-bold"
            >
              🔄 تصفير العدادات (0)
            </Button>
          </div>
        </div>

        {successMsg && (
          <Alert variant="success" className="rounded-4 mb-4 fw-bold">
            {successMsg}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="rounded-4 mb-4 fw-bold">
            {error}
          </Alert>
        )}

        {loading && !analyticsData ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" style={{ width: '3rem', height: '3rem' }} />
            <p className="text-light mt-3 fw-bold">جاري جلب إحصائيات المالك الحية من السيرفر...</p>
          </div>
        ) : analyticsData ? (
          <>
            {/* Top Key Metrics Row */}
            <Row className="g-4 mb-4">
              <Col xs={12} sm={6} lg={3}>
                <Card className="bg-slate-900 border-warning border-opacity-50 text-white rounded-4 shadow-lg p-3 h-100" style={{ background: '#0f172a' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-warning small fw-bold">إجمالي زوار المعرض</span>
                    <Users size={26} className="text-warning" />
                  </div>
                  <div className="fs-1 fw-black text-white">{(analyticsData.totalVisitors || 0).toLocaleString()}</div>
                  <div className="small text-muted mt-1">({(analyticsData.totalPageViews || 0).toLocaleString()} مشاهدة صفحة)</div>
                </Card>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <Card className="bg-slate-900 border-success border-opacity-50 text-white rounded-4 shadow-lg p-3 h-100" style={{ background: '#0f172a' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-success small fw-bold">إجمالي دقائق التصفح</span>
                    <Clock size={26} className="text-success" />
                  </div>
                  <div className="fs-1 fw-black text-success">
                    {Math.round((analyticsData.totalTimeSpentSeconds || 0) / 60).toLocaleString()} <span className="fs-5">دقيقة</span>
                  </div>
                  <div className="small text-muted mt-1">(~{(Math.round((analyticsData.totalTimeSpentSeconds || 0) / 3600 * 10) / 10)} ساعة تصفح)</div>
                </Card>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <Card className="bg-slate-900 border-info border-opacity-50 text-white rounded-4 shadow-lg p-3 h-100" style={{ background: '#0f172a' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-info small fw-bold">نقرات الواتساب الحية</span>
                    <MousePointerClick size={26} className="text-info" />
                  </div>
                  <div className="fs-1 fw-black text-info">{(analyticsData.whatsappClicks || 0).toLocaleString()} <span className="fs-5">استفسار</span></div>
                  <div className="small text-muted mt-1">(عملاء تواصلوا حياً عبر الواتس)</div>
                </Card>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <Card className="bg-slate-900 border-secondary border-opacity-50 text-white rounded-4 shadow-lg p-3 h-100" style={{ background: '#0f172a' }}>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <span className="text-light small fw-bold">أجهزة زوار المعرض</span>
                    <Smartphone size={26} className="text-light" />
                  </div>
                  <div className="d-flex align-items-center gap-3 mt-2">
                    <div>
                      <span className="small text-muted d-block">📱 موبايل:</span>
                      <strong className="fs-4 text-warning">{(analyticsData.mobileCount || 0)}</strong>
                    </div>
                    <div className="border-start border-secondary ps-3">
                      <span className="small text-muted d-block">💻 كمبيوتر:</span>
                      <strong className="fs-4 text-info">{(analyticsData.desktopCount || 0)}</strong>
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>

            {/* Detailed Breakdown Row */}
            <Row className="g-4">
              <Col md={6}>
                <Card className="bg-slate-900 border-secondary text-white rounded-4 p-4 h-100" style={{ background: '#0f172a' }}>
                  <h5 className="fw-bold text-warning mb-3 d-flex align-items-center gap-2">
                    💬 تفاصيل مصادر نقرات الاستفسارات:
                  </h5>
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-dark border border-secondary">
                      <span className="fw-bold text-light">💬 الشارة العائمة الملكية (استفسار عام):</span>
                      <Badge bg="warning" className="text-dark fs-6 px-3 py-1.5 rounded-pill">
                        {analyticsData.whatsappClickDetails?.floating_badge || 0} نقرة
                      </Badge>
                    </div>
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-dark border border-secondary">
                      <span className="fw-bold text-light">📦 كروت المنتجات مباشرة:</span>
                      <Badge bg="success" className="fs-6 px-3 py-1.5 rounded-pill">
                        {analyticsData.whatsappClickDetails?.product_card || 0} نقرة
                      </Badge>
                    </div>
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-dark border border-secondary">
                      <span className="fw-bold text-light">👁️ نافذة التفاصيل والمواصفات:</span>
                      <Badge bg="info" className="text-dark fs-6 px-3 py-1.5 rounded-pill">
                        {analyticsData.whatsappClickDetails?.product_modal || 0} نقرة
                      </Badge>
                    </div>
                    <div className="d-flex align-items-center justify-content-between p-3 rounded-3 bg-dark border border-secondary">
                      <span className="fw-bold text-light">🧮 حاسبة الكراتين والكميات الذكية:</span>
                      <Badge bg="primary" className="fs-6 px-3 py-1.5 rounded-pill">
                        {analyticsData.whatsappClickDetails?.tile_calculator || 0} مقايسة
                      </Badge>
                    </div>
                  </div>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="bg-slate-900 border-secondary text-white rounded-4 p-4 h-100" style={{ background: '#0f172a' }}>
                  <h5 className="fw-bold text-warning mb-3 d-flex align-items-center gap-2">
                    🕒 آخر نشاط وتأكيد الاتصال بالسيرفر:
                  </h5>
                  <div className="p-4 bg-dark border border-warning border-opacity-50 rounded-4 text-center">
                    <Clock size={42} className="text-warning mb-3" />
                    <div className="text-muted fs-6 mb-1">آخر زائر/تفاعل سجله الخادم السحابي Live:</div>
                    <div className="fs-5 fw-bold text-success">
                      {analyticsData.lastActivity ? new Date(analyticsData.lastActivity).toLocaleString('ar-EG') : 'الآن'}
                    </div>
                    <div className="mt-3 text-muted small">
                      ⚡ البيانات تتحدث تلقائياً وتُخزن بأمان داخل السيرفر سحابياً.
                    </div>
                  </div>
                </Card>
              </Col>
            </Row>
          </>
        ) : null}
      </Container>
    </div>
  );
};

export default OwnerAnalytics;
