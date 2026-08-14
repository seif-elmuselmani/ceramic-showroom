import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert, ProgressBar, Modal, Form, Table } from 'react-bootstrap';
import { 
  BarChart3, Clock, Users, MousePointerClick, Smartphone, RefreshCw, 
  ShieldCheck, Lock, Download, Zap, Eye, PieChart, Sparkles, Activity, 
  Upload, QrCode, Search, AlertTriangle, CheckCircle2, TrendingUp, 
  FileSpreadsheet, PackageX, Layers, ExternalLink 
} from 'lucide-react';
import axios from 'axios';

const OwnerAnalytics = ({ onNavigate }) => {
  const [analyticsData, setAnalyticsData] = useState(null);
  const [productsList, setProductsList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [successMsg, setSuccessMsg] = useState('');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [lastRefreshedTime, setLastRefreshedTime] = useState(new Date());

  // Modal States
  const [showImportModal, setShowImportModal] = useState(false);
  const [showQRModal, setShowQRModal] = useState(false);
  const [csvTextContent, setCsvTextContent] = useState('');
  const [importing, setImporting] = useState(false);

  const queryParams = new URLSearchParams(window.location.search);
  const secretKey = queryParams.get('secret') || 'elgazar_owner_super_secret_backup_2026';

  const fetchAnalytics = async () => {
    try {
      setLoading(true);
      setError(null);
      const [analyticsRes, productsRes] = await Promise.all([
        axios.get(`/api/analytics/stats?secret=${encodeURIComponent(secretKey)}`),
        axios.get('/api/products').catch(() => ({ data: [] }))
      ]);
      setAnalyticsData(analyticsRes.data);
      if (Array.isArray(productsRes.data)) {
        setProductsList(productsRes.data);
      }
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
      }, 10000);
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

  // Download Full Database JSON Backup
  const handleDownloadJSONBackup = async () => {
    try {
      const [prodRes, catRes, setRes] = await Promise.all([
        axios.get('/api/products'),
        axios.get('/api/categories'),
        axios.get('/api/settings')
      ]);

      const backupData = {
        timestamp: new Date().toISOString(),
        settings: setRes.data,
        categories: catRes.data,
        products: prodRes.data,
        analytics: analyticsData
      };

      const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(backupData, null, 2));
      const downloadAnchor = document.createElement('a');
      downloadAnchor.setAttribute("href", dataStr);
      downloadAnchor.setAttribute("download", `Elgazar_Showroom_Full_Backup_${Date.now()}.json`);
      document.body.appendChild(downloadAnchor);
      downloadAnchor.click();
      downloadAnchor.remove();

      setSuccessMsg('تم تحميل النسخة الاحتياطية الكاملة (JSON) بنجاح!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Backup download error:', err);
      alert('حدث خطأ أثناء تحميل النسخة الاحتياطية');
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

  // Copy Secret Key to Clipboard
  const handleCopySecretKey = () => {
    navigator.clipboard.writeText(secretKey);
    setSuccessMsg('تم نسخ المفتاح السري للمالك بنجاح إلى الحافظة! 📋');
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Parse & Bulk Import CSV
  const handleFileUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      setCsvTextContent(event.target.result);
    };
    reader.readAsText(file);
  };

  const parseCSVToItems = (csvRaw) => {
    const lines = csvRaw.split(/\r?\n/).filter(line => line.trim() !== '');
    if (lines.length <= 1) return [];

    const parseRow = (text) => {
      const result = [];
      let cur = '';
      let inQuotes = false;
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (c === '"') {
          inQuotes = !inQuotes;
        } else if (c === ',' && !inQuotes) {
          result.push(cur.trim().replace(/^"|"$/g, ''));
          cur = '';
        } else {
          cur += c;
        }
      }
      result.push(cur.trim().replace(/^"|"$/g, ''));
      return result;
    };

    const items = [];
    for (let i = 1; i < lines.length; i++) {
      const row = parseRow(lines[i]);
      if (row.length < 2) continue;

      const codeVal = row[1] || row[0] || `IMPORT-${Date.now()}-${i}`;
      const nameVal = row[2] || row[1] || row[0];
      const catVal = row[3] || 'سيراميك أرضيات';

      if (nameVal && nameVal !== 'اسم الصنف') {
        items.push({
          code: codeVal,
          name: nameVal,
          category: catVal,
          subcategory: row[4] || '',
          brand: row[5] || 'ماركة فاخرة',
          price: Number(row[6]) || 0,
          originalPrice: Number(row[7]) || 0,
          boxCoverage: Number(row[9]) || 1.44,
          dimensions: row[10] || '60x60 سم',
          finish: row[11] || 'لامع',
          grade: row[12] || 'فرز أول',
          origin: row[13] || 'مستورد',
          inStock: row[14] ? (!row[14].includes('غير')) : true,
          featured: row[15] ? (row[15].includes('مميز')) : false,
          image: row[17] || ''
        });
      }
    }
    return items;
  };

  const handleExecuteBulkImport = async () => {
    if (!csvTextContent.trim()) {
      alert('يرجى اختيار ملف CSV أولاً أو لصق محتواه في الخانة المخصصة');
      return;
    }

    try {
      setImporting(true);
      const items = parseCSVToItems(csvTextContent);
      if (items.length === 0) {
        alert('لم يتم العثور على أسطر صالحة للاستيراد في الملف');
        setImporting(false);
        return;
      }

      const res = await axios.post(`/api/owner/import-products?secret=${encodeURIComponent(secretKey)}`, { products: items });
      setSuccessMsg(`🎉 ${res.data.message || `تم استيراد ${items.length} صنف بنجاح!`}`);
      setShowImportModal(false);
      setCsvTextContent('');
      fetchAnalytics();
      setTimeout(() => setSuccessMsg(''), 5000);
    } catch (err) {
      console.error('Bulk Import error:', err);
      alert('حدث خطأ أثناء استيراد الأصناف: ' + (err.response?.data?.message || err.message));
    } finally {
      setImporting(false);
    }
  };

  // Toggle Stock Status
  const handleRestockProduct = async (prodId) => {
    try {
      const token = localStorage.getItem('ceramic_admin_token');
      const headers = token ? { Authorization: `Bearer ${token}` } : {};
      await axios.put(`/api/products/${prodId}`, { inStock: true }, { headers });
      setProductsList(prev => prev.map(p => p.id === prodId ? { ...p, inStock: true } : p));
      setSuccessMsg('تم تعديل حالة الصنف إلى "متوفر بالمخزن 🟢" بنجاح!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Restock error:', err);
      alert('تم إرسال الطلب، يرجى إعادة تنشيط الصفحة للتأكيد.');
    }
  };

  const totalDeviceVisits = (analyticsData?.mobileCount || 0) + (analyticsData?.desktopCount || 0) || 1;
  const mobilePercent = Math.round(((analyticsData?.mobileCount || 0) / totalDeviceVisits) * 100);
  const desktopPercent = 100 - mobilePercent;

  const totalWaClicks = analyticsData?.whatsappClicks || 1;
  const floatingBadgeCount = analyticsData?.whatsappClickDetails?.floating_badge || 0;
  const productCardCount = analyticsData?.whatsappClickDetails?.product_card || 0;
  const productModalCount = analyticsData?.whatsappClickDetails?.product_modal || 0;
  const tileCalcCount = analyticsData?.whatsappClickDetails?.tile_calculator || 0;

  // Process Top Viewed Products
  const productViewsMap = analyticsData?.productViews || {};
  const sortedProductsByViews = [...productsList]
    .map(p => ({ ...p, viewsCount: productViewsMap[p.id] || productViewsMap[p._id] || 0 }))
    .sort((a, b) => b.viewsCount - a.viewsCount);
  const topViewedProducts = sortedProductsByViews.filter(p => p.viewsCount > 0).slice(0, 5);

  // Process Search Queries
  const searchQueriesMap = analyticsData?.searchQueries || {};
  const sortedSearchQueries = Object.entries(searchQueriesMap)
    .map(([query, count]) => ({ query, count }))
    .sort((a, b) => b.count - a.count);

  // Out of Stock Products List
  const outOfStockProducts = productsList.filter(p => p.inStock === false);

  const siteOrigin = typeof window !== 'undefined' ? window.location.origin : 'https://ceramic-showroom.vercel.app';
  const qrCodeImageUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(siteOrigin)}`;

  return (
    <div className="py-5 min-vh-100" style={{ backgroundColor: '#f8fafc', color: '#0f172a', fontFamily: 'system-ui, -apple-system, sans-serif' }}>
      <Container>
        {/* Header Banner */}
        <div className="p-4 mb-4 rounded-4 shadow-sm border border-warning-subtle bg-white">
          <div className="d-flex flex-column flex-lg-row justify-content-between align-items-lg-center gap-3">
            <div>
              <div className="d-flex align-items-center gap-2 mb-2 flex-wrap">
                <Badge bg="warning" className="text-dark fw-black px-3 py-1.5 rounded-pill fs-7 d-inline-flex align-items-center gap-1 shadow-sm">
                  <Lock size={14} /> لوحة المالك الحصرية VIP
                </Badge>
                <Badge bg="success" className="px-3 py-1.5 rounded-pill small d-inline-flex align-items-center gap-1 shadow-sm">
                  <ShieldCheck size={14} /> خادم Vercel Live نشط
                </Badge>
                <span className="badge bg-primary bg-opacity-10 text-primary border border-primary border-opacity-20 rounded-pill px-3 py-1 small d-inline-flex align-items-center gap-1 fw-bold">
                  <Activity size={13} className="text-primary" /> بث مباشر لحظي
                </span>
              </div>
              <h1 className="fw-black text-dark mb-1 d-flex align-items-center gap-3 fs-2">
                <BarChart3 size={36} className="text-warning" />
                لوحة الإحصائيات والتحليلات السرية للمالك
              </h1>
              <p className="text-muted fs-6 mb-0">متابعة دقيقة لحظية لكافة الزوار، الأصناف الأكثر طلباً، أدوات الاستيراد، ورمز الـ QR Code</p>
            </div>

            {/* Quick Actions Control Toolbar */}
            <div className="d-flex align-items-center gap-2 flex-wrap">
              {onNavigate && (
                <Button 
                  variant="dark" 
                  size="sm" 
                  onClick={() => onNavigate('catalog')}
                  className="rounded-pill fw-bold px-3 py-2 text-warning"
                >
                  🏛️ العودة للكتالوج
                </Button>
              )}

              <Button 
                variant={autoRefresh ? "warning" : "outline-secondary"} 
                size="sm" 
                onClick={() => setAutoRefresh(!autoRefresh)}
                className="rounded-pill fw-bold text-nowrap px-3 py-2 text-dark"
              >
                {autoRefresh ? '🟢 التحديث التلقائي نشط' : '⏸️ التحديث متوقف'}
              </Button>

              <Button 
                variant="outline-dark" 
                size="sm" 
                onClick={fetchAnalytics}
                className="rounded-pill fw-bold px-3 py-2"
              >
                <RefreshCw size={15} className="me-1" /> تحديث الآن
              </Button>

              <Button 
                variant="outline-primary" 
                size="sm" 
                onClick={handleExportCSV}
                className="rounded-pill fw-bold px-3 py-2"
              >
                <Download size={15} className="me-1" /> تصدير CSV
              </Button>

              <Button 
                variant="outline-danger" 
                size="sm" 
                onClick={handleResetAnalytics}
                className="rounded-pill fw-bold px-3 py-2"
              >
                🔄 تصفير العدادات (0)
              </Button>
            </div>
          </div>
        </div>

        {successMsg && (
          <Alert variant="success" className="rounded-4 mb-4 fw-bold shadow-sm border-success">
            {successMsg}
          </Alert>
        )}

        {error && (
          <Alert variant="danger" className="rounded-4 mb-4 fw-bold shadow-sm border-danger">
            {error}
          </Alert>
        )}

        {/* Owner Essential Tools & Quick Links Suite Card */}
        <div className="p-4 mb-4 rounded-4 shadow-sm bg-white border border-slate-200">
          <div className="d-flex align-items-center justify-content-between mb-3 pb-2 border-bottom">
            <h5 className="fw-black text-dark mb-0 d-flex align-items-center gap-2">
              <Sparkles className="text-warning" size={22} />
              🧰 مركز أدوات وروابط المالك الملكية (Quick Owner Command Suite)
            </h5>
            <span className="badge bg-warning bg-opacity-15 text-dark fw-bold px-3 py-1.5 rounded-pill border border-warning border-opacity-30">
              وصلات سريعة 100%
            </span>
          </div>

          <Row className="g-3">
            <Col xs={12} sm={6} md={4} lg={2}>
              <Button 
                variant="warning" 
                onClick={() => setShowImportModal(true)} 
                className="w-100 py-2.5 rounded-3 fw-black text-dark d-flex align-items-center justify-content-center gap-2 fs-7 shadow-sm"
              >
                <Upload size={16} /> ⚡ استيراد إكسيل 1-Click
              </Button>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2}>
              <Button 
                variant="dark" 
                onClick={() => setShowQRModal(true)} 
                className="w-100 py-2.5 rounded-3 fw-bold text-warning d-flex align-items-center justify-content-center gap-2 fs-7 shadow-sm"
              >
                <QrCode size={16} /> 📱 رمز QR Code للمعرض
              </Button>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2}>
              <Button 
                variant="outline-dark" 
                onClick={handleDownloadJSONBackup} 
                className="w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 fs-7 shadow-sm"
              >
                📦 نسخة JSON كاملة
              </Button>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2}>
              <Button 
                variant="outline-warning" 
                onClick={() => window.open('/api/export-csv', '_blank')} 
                className="w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 text-dark fs-7 shadow-sm"
              >
                📊 تصدير Excel المنتجات
              </Button>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2}>
              <Button 
                variant="outline-primary" 
                onClick={() => window.open('/api/download-all-zip', '_blank')} 
                className="w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 fs-7 shadow-sm"
              >
                📁 تحميل ZIP الصور
              </Button>
            </Col>

            <Col xs={12} sm={6} md={4} lg={2}>
              <Button 
                variant="outline-secondary" 
                onClick={handleCopySecretKey} 
                className="w-100 py-2.5 rounded-3 fw-bold d-flex align-items-center justify-content-center gap-2 fs-7 shadow-sm"
              >
                🔑 نسخ مفتاح المالك
              </Button>
            </Col>
          </Row>
        </div>

        {loading && !analyticsData ? (
          <div className="text-center py-5">
            <Spinner animation="border" variant="warning" style={{ width: '3.5rem', height: '3.5rem' }} />
            <p className="text-dark mt-3 fw-bold fs-5">جاري جلب التحليلات الحية من السيرفر السحابي...</p>
          </div>
        ) : analyticsData ? (
          <>
            {/* Top 4 Ultra-Clean High-Contrast Metric Cards */}
            <Row className="g-4 mb-4">
              <Col xs={12} sm={6} lg={3}>
                <div className="p-4 rounded-4 shadow-sm bg-white border border-warning border-opacity-50 h-100">
                  <div className="d-flex align-items-center justify-content-between mb-3">
                    <span className="text-dark fw-bold small text-uppercase">👥 إجمالي زوار المعرض</span>
                    <div className="p-2 rounded-3 bg-warning bg-opacity-15 text-dark fw-bold">
                      <Users size={24} className="text-warning" />
                    </div>
                  </div>
                  <div className="fs-1 fw-black text-dark mb-1">{(analyticsData.totalVisitors || 0).toLocaleString()}</div>
                  <div className="d-flex align-items-center gap-1 text-muted small fw-semibold">
                    <Eye size={15} className="text-warning" />
                    <span>({(analyticsData.totalPageViews || 0).toLocaleString()} مشاهدة صفحة)</span>
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
                    {Math.round((analyticsData.totalTimeSpentSeconds || 0) / 60).toLocaleString()} <span className="fs-5 fw-bold text-dark">دقيقة</span>
                  </div>
                  <div className="text-muted small fw-semibold">
                    (~{(Math.round((analyticsData.totalTimeSpentSeconds || 0) / 3600 * 10) / 10)} ساعة تصفح إجمالية)
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
                  <div className="fs-1 fw-black text-primary mb-1">{(analyticsData.whatsappClicks || 0).toLocaleString()} <span className="fs-5 fw-bold text-dark">نقرة</span></div>
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
                      <strong className="fs-4 text-dark font-black">{(analyticsData.mobileCount || 0)}</strong>
                    </div>
                    <div className="text-end border-start border-slate-200 ps-3">
                      <span className="small text-muted d-block fw-bold">💻 كمبيوتر:</span>
                      <strong className="fs-4 text-dark font-black">{(analyticsData.desktopCount || 0)}</strong>
                    </div>
                  </div>
                  <ProgressBar style={{ height: '8px' }} className="rounded-pill bg-light border">
                    <ProgressBar variant="warning" now={mobilePercent} key={1} />
                    <ProgressBar variant="info" now={desktopPercent} key={2} />
                  </ProgressBar>
                </div>
              </Col>
            </Row>

            {/* Top Products & Search Keywords Section */}
            <Row className="g-4 mb-4">
              {/* Top 5 Most Viewed Tile Products */}
              <Col lg={7}>
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
              </Col>

              {/* Popular Search Terms & Out of Stock Alerts */}
              <Col lg={5}>
                <div className="d-flex flex-column gap-4 h-100">
                  {/* Popular Search Keywords */}
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

                  {/* Out of Stock Inventory Alerts */}
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
                </div>
              </Col>
            </Row>

            {/* Detailed Visual Analytics Breakdown */}
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
                      إجمالي {analyticsData.whatsappClicks || 0} نقرة
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
                        {analyticsData.lastActivity ? new Date(analyticsData.lastActivity).toLocaleString('ar-EG') : 'الآن'}
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
          </>
        ) : null}
      </Container>

      {/* 1-Click Excel CSV Bulk Import Modal */}
      <Modal show={showImportModal} onHide={() => setShowImportModal(false)} centered size="lg" className="rounded-4">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-black text-dark d-flex align-items-center gap-2 fs-5">
            <Upload className="text-warning" size={24} />
            ⚡ أداة استيراد وتحديث المنتجات من إكسيل (Bulk Import)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <Alert variant="info" className="rounded-3 small fw-bold mb-3 border-info">
            💡 يمكنك رفع ملف CSV المستخرج من Excel أو تصدير المعرض السريع. ستقوم الأداة بمطابقة الأصناف بكود الصنف وتحديث الأسعار أو إضافة الأصناف الجديدة تلقائياً!
          </Alert>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold text-dark">اختر ملف CSV من جهازك:</Form.Label>
            <Form.Control type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="rounded-3" />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label className="fw-bold text-dark">أو قم بلصق نص محتوى CSV هنا مباشرة:</Form.Label>
            <Form.Control 
              as="textarea" 
              rows={6} 
              value={csvTextContent}
              onChange={(e) => setCsvTextContent(e.target.value)}
              placeholder={`ID,"كود الصنف","اسم الصنف","الفئة الرئيسية","الفئة الفرعية","الماركة","السعر الحالي"\n"1","ESP-60120","بورسلين إسباني كالاكاتا","بورسلين مستورد","إسباني","Porcelanosa","650"`}
              className="rounded-3 fs-7 font-monospace"
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0">
          <Button variant="outline-secondary" className="rounded-pill fw-bold" onClick={() => setShowImportModal(false)}>
            إلغاء
          </Button>
          <Button 
            variant="warning" 
            className="rounded-pill fw-black text-dark px-4"
            disabled={importing || !csvTextContent.trim()}
            onClick={handleExecuteBulkImport}
          >
            {importing ? <Spinner animation="border" size="sm" /> : '🚀 بدء الاستيراد بنقرة واحدة'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Showroom HD QR Code Generator Modal */}
      <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered className="rounded-4 text-center">
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="fw-black text-dark d-flex align-items-center gap-2 fs-5 w-100 justify-content-center">
            <QrCode className="text-warning" size={24} />
            📱 رمز QR Code الملكي للمعرض (Showroom QR)
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="py-4">
          <p className="text-muted small fw-bold mb-3">
            اطبع هذا الرمز وضعه في الفروع (بنها - مدخل قبلي / برج السنهوي)، ليمسحه الزبائن بهواتفهم وتصفح الكتالوج بالكامل!
          </p>

          <div className="p-4 bg-white border border-warning rounded-4 d-inline-block shadow-sm mb-3">
            <img src={qrCodeImageUrl} alt="Showroom QR Code" style={{ width: '220px', height: '220px' }} />
          </div>

          <div className="small text-dark font-monospace fw-bold mb-3">
            {siteOrigin}
          </div>
        </Modal.Body>
        <Modal.Footer className="border-0 pt-0 justify-content-center">
          <Button 
            variant="warning" 
            className="rounded-pill fw-black text-dark px-4 d-inline-flex align-items-center gap-2"
            onClick={() => window.open(qrCodeImageUrl, '_blank')}
          >
            <Download size={16} /> تحميل الصورة بجودة عالية HD
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default OwnerAnalytics;
