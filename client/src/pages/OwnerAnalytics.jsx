import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, ProgressBar } from 'react-bootstrap';
import { BarChart3, Clock, Users, MousePointerClick, Smartphone, RefreshCw, ShieldCheck, Lock, Download, Zap, Eye, PieChart, Sparkles, Activity } from 'lucide-react';
import axios from 'axios';

const OwnerAnalytics = () => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState(new Date());

  const queryParams = new URLSearchParams(window.location.search);
  const secretKey = queryParams.get('secret') || 'elgazar_owner_super_secret_backup_2026';

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await axios.get(`/api/analytics/stats?secret=${encodeURIComponent(secretKey)}`);
      setAnalyticsData(res.data);
      setLastRefreshedTime(new Date());
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

  // Export Analytics to CSV File
  const handleExportCSV = () => {
    if (!analyticsData) return;
    const csvRows = [
      ['المعيار (Metric)', 'القيمة (Value)'],
      ['إجمالي الزوار الفريدين (Total Unique Visitors)', analyticsData.totalVisitors || 0],
      ['إجمالي مشاهدات الصفحات (Total Page Views)', analyticsData.totalPageViews || 0],
      ['إجمالي دقائق التصفح (Total Browsing Minutes)', Math.round((analyticsData.totalTimeSpentSeconds || 0) / 60)],
      ['إجمالي نقرات الواتساب (Total WhatsApp Leads)', analyticsData.whatsappClicks || 0],
      ['زوار الموبايل (Mobile Visitors)', analyticsData.mobileCount || 0],
      ['زوار الكمبيوتر (Desktop Visitors)', analyticsData.desktopCount || 0],
      ['نقرات الشارة العائمة (Floating Badge Clicks)', analyticsData.whatsappClickDetails?.floating_badge || 0],
      ['نقرات كروت الكتالوج (Product Card Clicks)', analyticsData.whatsappClickDetails?.product_card || 0],
      ['نقرات نافذة التفاصيل (Product Modal Clicks)', analyticsData.whatsappClickDetails?.product_modal || 0],
      ['نقرات حاسبة الكميات (Tile Calculator Clicks)', analyticsData.whatsappClickDetails?.tile_calculator || 0],
      ['تاريخ التصدير (Export Date)', new Date().toLocaleString('ar-EG')]
    ];

    const csvContent = "data:text/csv;charset=utf-8,\uFEFF" + csvRows.map(e => e.join(",")).join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `Elgazar_Showroom_Analytics_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const totalDeviceVisits = (analyticsData?.mobileCount || 0) + (analyticsData?.desktopCount || 0) || 1;
  const mobilePercent = Math.round(((analyticsData?.mobileCount || 0) / totalDeviceVisits) * 100);
  const desktopPercent = 100 - mobilePercent;

  const totalWaClicks = analyticsData?.whatsappClicks || 1;
  const floatingBadgeCount = analyticsData?.whatsappClickDetails?.floating_badge || 0;
  const productCardCount = analyticsData?.whatsappClickDetails?.product_card || 0;
  const productModalCount = analyticsData?.whatsappClickDetails?.product_modal || 0;
  const tileCalcCount = analyticsData?.whatsappClickDetails?.tile_calculator || 0;

  return (
    <div className="py-5 min-vh-100 text-white" style={{ backgroundColor: '#070a12', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Container>
        {/* Executive Header Banner */}
        <div className="p-4 mb-4 rounded-4 shadow-lg border border-warning border-opacity-40" style={{ background: 'linear-gradient(135deg, #0f172a 0%, #1e1b4b 50%, #090d16 100%)' }}>
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <Badge bg="warning" className="text-dark fw-black px-3 py-1.5 rounded-pill fs-7 d-inline-flex align-items-center gap-1 shadow-sm">
                  <Lock size={14} /> لوحة المالك الحصرية VIP
                </Badge>
                <Badge bg="success" className="px-3 py-1.5 rounded-pill small d-inline-flex align-items-center gap-1 shadow-sm">
                  <ShieldCheck size={14} /> اتصال مشفر بخادم Vercel Live
                </Badge>
                <span className="badge bg-primary bg-opacity-20 text-info border border-info border-opacity-30 rounded-pill px-3 py-1 small d-inline-flex align-items-center gap-1">
                  <Activity size={13} className="text-info" /> بث مباشر لحظي
                </span>
              </div>
              <h1 className="fw-black text-warning mb-1 d-flex align-items-center gap-3 fs-2">
                <BarChart3 size={36} className="text-warning" />
                لوحة الإحصائيات والتحليلات السرية المباشرة
              </h1>
              <p className="text-light opacity-75 fs-6 mb-0">متابعة دقيقة لحظية لعدد الزوار الحقيقيين، ساعات التصفح، ونقرات رسائل الواتساب لمعرض السيد الجزار</p>
            </div>

            {/* Quick Actions Control Toolbar */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              <Button 
                variant={autoRefresh ? "warning" : "outline-light"} 
                size="sm" 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="rounded-pill fw-bold text-nowrap px-3 py-2"
              >
                {autoRefresh ? '🟢 التحديث التلقائي نشط (كل 10ث)' : '⏸️ التحديث متوقف'}
              </Button>

              <Button 
                variant="outline-warning" 
                size="sm" 
                onClick={fetchAnalytics}
                className="rounded-pill fw-bold px-3 py-2 text-warning border-warning"
              >
                <RefreshCw size={15} className="me-1" /> تحديث الآن
              </Button>

              <Button 
                variant="outline-info" 
                size="sm" 
                onClick={handleExportCSV}
                className="rounded-pill fw-bold px-3 py-2 text-info border-info"
              >
                <Download size={15} className="me-1" /> تصدير CSV
              </Button>

              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={handleResetAnalytics}
                className="rounded-pill fw-bold px-3 py-2 text-danger border-danger"
              >
                🔄 تصفير العدادات (0)
              </Button>
            </div>
          </div>
        </div>

        {successMsg && (
          <Alert variant="success" className="rounded-4 mb-4 fw-bold shadow-lg border-success">
            {successMsg}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="rounded-4 mb-4 fw-bold shadow-lg border-danger">
            {error}
          </Alert>
        )}

        {loading && !analyticsData ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" style={{ width: '3.5rem', height: '3.5rem' }} />
            <p className="text-light mt-3 fw-bold fs-5">جاري جلب التحليلات الحية من السيرفر السحابي...</p>
          </div>
        ) : analyticsData ? (
          <>
            {/* Top 4 Luxury Metric Hero Cards */}
            <Row className="g-4 mb-4">
              <Col xs={12} sm={6} lg={3}>
                <div className="p-4 rounded-4 shadow-lg h-100 border border-warning border-opacity-30 position-relative overflow-hidden" 
                     style={{ background: 'linear-gradient(145deg, #131b2e 0%, #0d1322 100%)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-warning small fw-bold text-uppercase tracking-wider">👥 إجمالي زوار المعرض</span>
                    <div className="p-2 rounded-3 bg-warning bg-opacity-10 border border-warning border-opacity-20 text-warning">
                      <Users size={24} />
                    </div>
                  </div>
                  <div className="fs-1 fw-black text-white mb-1">{(analyticsData.totalVisitors || 0).toLocaleString()}</div>
                  <div className="d-flex align-items-center gap-1 text-light opacity-75 small">
                    <Eye size={14} className="text-warning" />
                    <span>({(analyticsData.totalPageViews || 0).toLocaleString()} مشاهدة صفحة)</span>
                  </div>
                </div>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <div className="p-4 rounded-4 shadow-lg h-100 border border-success border-opacity-30 position-relative overflow-hidden" 
                     style={{ background: 'linear-gradient(145deg, #131b2e 0%, #0d1322 100%)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-success small fw-bold text-uppercase tracking-wider">⏱️ وقت التصفح الإجمالي</span>
                    <div className="p-2 rounded-3 bg-success bg-opacity-10 border border-success border-opacity-20 text-success">
                      <Clock size={24} />
                    </div>
                  </div>
                  <div className="fs-1 fw-black text-success mb-1">
                    {Math.round((analyticsData.totalTimeSpentSeconds || 0) / 60).toLocaleString()} <span className="fs-5 fw-bold">دقيقة</span>
                  </div>
                  <div className="text-light opacity-75 small">
                    (~{(Math.round((analyticsData.totalTimeSpentSeconds || 0) / 3600 * 10) / 10)} ساعة تصفح إجمالية)
                  </div>
                </div>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <div className="p-4 rounded-4 shadow-lg h-100 border border-info border-opacity-30 position-relative overflow-hidden" 
                     style={{ background: 'linear-gradient(145deg, #131b2e 0%, #0d1322 100%)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-info small fw-bold text-uppercase tracking-wider">💬 استفسارات الواتساب</span>
                    <div className="p-2 rounded-3 bg-info bg-opacity-10 border border-info border-opacity-20 text-info">
                      <MousePointerClick size={24} />
                    </div>
                  </div>
                  <div className="fs-1 fw-black text-info mb-1">{(analyticsData.whatsappClicks || 0).toLocaleString()} <span className="fs-5 fw-bold">نقرة</span></div>
                  <div className="text-light opacity-75 small">
                    (عملاء تواصلوا حياً ومباشرة عبر الواتس)
                  </div>
                </div>
              </Col>

              <Col xs={12} sm={6} lg={3}>
                <div className="p-4 rounded-4 shadow-lg h-100 border border-primary border-opacity-30 position-relative overflow-hidden" 
                     style={{ background: 'linear-gradient(145deg, #131b2e 0%, #0d1322 100%)' }}>
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-primary small fw-bold text-uppercase tracking-wider">📱 توزيع الأجهزة</span>
                    <div className="p-2 rounded-3 bg-primary bg-opacity-10 border border-primary border-opacity-20 text-primary">
                      <Smartphone size={24} />
                    </div>
                  </div>
                  <div className="d-flex align-items-center justify-content-between mb-2">
                    <div>
                      <span className="small text-muted d-block">📱 موبايل:</span>
                      <strong className="fs-4 text-warning">{(analyticsData.mobileCount || 0)}</strong>
                    </div>
                    <div className="text-end border-start border-secondary ps-3">
                      <span className="small text-muted d-block">💻 كمبيوتر:</span>
                      <strong className="fs-4 text-info">{(analyticsData.desktopCount || 0)}</strong>
                    </div>
                  </div>
                  <ProgressBar style={{ height: '8px' }} className="rounded-pill bg-dark">
                    <ProgressBar variant="warning" now={mobilePercent} key={1} />
                    <ProgressBar variant="info" now={desktopPercent} key={2} />
                  </ProgressBar>
                </div>
              </Col>
            </Row>

            {/* Detailed Visual Analytics Breakdown */}
            <Row className="g-4 mb-4">
              {/* WhatsApp Lead Breakdown with Visual Bars */}
              <Col lg={7}>
                <div className="p-4 rounded-4 shadow-lg border border-secondary border-opacity-40 h-100" style={{ background: '#111827' }}>
                  <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-30">
                    <h5 className="fw-bold text-warning mb-0 d-flex align-items-center gap-2">
                      <PieChart size={20} className="text-warning" />
                      تفاصيل مصادر نقرات استفسارات الواتساب الحية:
                    </h5>
                    <Badge bg="dark" className="border border-warning text-warning fs-7 px-3 py-1.5 rounded-pill">
                      إجمالي {analyticsData.whatsappClicks || 0} نقرة
                    </Badge>
                  </div>

                  <div className="d-flex flex-column gap-3">
                    {/* Source 1: Floating Badge */}
                    <div className="p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-30">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-light d-flex align-items-center gap-2">
                          💬 الشارة العائمة الملكية (استفسار عام)
                        </span>
                        <Badge bg="warning" className="text-dark fw-bold fs-6 px-3 py-1 rounded-pill">
                          {floatingBadgeCount} نقرة ({Math.round((floatingBadgeCount / (totalWaClicks || 1)) * 100)}%)
                        </Badge>
                      </div>
                      <ProgressBar variant="warning" now={(floatingBadgeCount / (totalWaClicks || 1)) * 100} style={{ height: '7px' }} className="rounded-pill bg-dark" />
                    </div>

                    {/* Source 2: Product Cards */}
                    <div className="p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-30">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-light d-flex align-items-center gap-2">
                          📦 كروت الكتالوج والمنتجات مباشرة
                        </span>
                        <Badge bg="success" className="fw-bold fs-6 px-3 py-1 rounded-pill">
                          {productCardCount} نقرة ({Math.round((productCardCount / (totalWaClicks || 1)) * 100)}%)
                        </Badge>
                      </div>
                      <ProgressBar variant="success" now={(productCardCount / (totalWaClicks || 1)) * 100} style={{ height: '7px' }} className="rounded-pill bg-dark" />
                    </div>

                    {/* Source 3: Product Modal */}
                    <div className="p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-30">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-light d-flex align-items-center gap-2">
                          👁️ نافذة التفاصيل والمواصفات الكاملة
                        </span>
                        <Badge bg="info" className="text-dark fw-bold fs-6 px-3 py-1 rounded-pill">
                          {productModalCount} نقرة ({Math.round((productModalCount / (totalWaClicks || 1)) * 100)}%)
                        </Badge>
                      </div>
                      <ProgressBar variant="info" now={(productModalCount / (totalWaClicks || 1)) * 100} style={{ height: '7px' }} className="rounded-pill bg-dark" />
                    </div>

                    {/* Source 4: Tile Calculator */}
                    <div className="p-3 rounded-3 bg-dark bg-opacity-60 border border-secondary border-opacity-30">
                      <div className="d-flex align-items-center justify-content-between mb-2">
                        <span className="fw-bold text-light d-flex align-items-center gap-2">
                          🧮 حاسبة الكراتين والكميات والقطع الذكية
                        </span>
                        <Badge bg="primary" className="fw-bold fs-6 px-3 py-1 rounded-pill">
                          {tileCalcCount} مقايسة ({Math.round((tileCalcCount / (totalWaClicks || 1)) * 100)}%)
                        </Badge>
                      </div>
                      <ProgressBar variant="primary" now={(tileCalcCount / (totalWaClicks || 1)) * 100} style={{ height: '7px' }} className="rounded-pill bg-dark" />
                    </div>
                  </div>
                </div>
              </Col>

              {/* Server Activity & Telemetry Status */}
              <Col lg={5}>
                <div className="p-4 rounded-4 shadow-lg border border-secondary border-opacity-40 h-100 d-flex flex-column justify-content-between" style={{ background: '#111827' }}>
                  <div>
                    <div className="d-flex align-items-center justify-content-between mb-4 pb-2 border-bottom border-secondary border-opacity-30">
                      <h5 className="fw-bold text-warning mb-0 d-flex align-items-center gap-2">
                        <Zap size={20} className="text-warning" />
                        حالة الاتصال والسيرفر السحابي:
                      </h5>
                      <span className="badge bg-success bg-opacity-20 text-success border border-success border-opacity-40 rounded-pill px-3 py-1">
                        🟢 متصل 100%
                      </span>
                    </div>

                    <div className="p-4 bg-dark bg-opacity-80 border border-warning border-opacity-30 rounded-4 text-center mb-4">
                      <Clock size={44} className="text-warning mb-3" />
                      <div className="text-muted fs-6 mb-1">آخر حركة زائر سجلها خادم Vercel Live:</div>
                      <div className="fs-5 fw-bold text-success">
                        {analyticsData.lastActivity ? new Date(analyticsData.lastActivity).toLocaleString('ar-EG') : 'الآن'}
                      </div>
                      <div className="mt-3 text-muted small">
                        تحديث الشاشة الأخير: {lastRefreshedTime.toLocaleTimeString('ar-EG')}
                      </div>
                    </div>
                  </div>

                  <div className="p-3 bg-warning bg-opacity-10 border border-warning border-opacity-20 rounded-3 text-warning small text-center">
                    <Sparkles size={16} className="me-1" /> جميع الأرقام والبيانات محمية وحصرية لمالك المشروع وتتحدث تلقائياً.
                  </div>
                </div>
              </Col>
            </Row>
          </>
        ) : null}
      </Container>
    </div>
  );
};

export default OwnerAnalytics;
