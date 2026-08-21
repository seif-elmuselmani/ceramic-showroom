import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Badge, Button, Spinner, Alert } from 'react-bootstrap';
import { 
  BarChart3, ShieldCheck, Lock, Activity, RefreshCw, Download, Sparkles, 
  Upload, QrCode
} from 'lucide-react';
import api from '../services/api';

import StatsCards from '../components/owner/StatsCards';
import TopViewedProducts from '../components/owner/TopViewedProducts';
import PopularKeywords from '../components/owner/PopularKeywords';
import InventoryAlerts from '../components/owner/InventoryAlerts';
import AnalyticsDetails from '../components/owner/AnalyticsDetails';
import BulkImportModal from '../components/owner/BulkImportModal';
import QRCodeGenerator from '../components/owner/QRCodeGenerator';

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
        api.get(`/analytics/stats?secret=${encodeURIComponent(secretKey)}`),
        api.get('/products').catch(() => ({ data: [] }))
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
        const res = await api.post(`/analytics/reset?secret=${encodeURIComponent(secretKey)}`);
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
        api.get('/products'),
        api.get('/categories'),
        api.get('/settings')
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

      const res = await api.post(`/owner/import-products?secret=${encodeURIComponent(secretKey)}`, { products: items });
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
      await api.put(`/products/${prodId}`, { inStock: true });
      setProductsList(prev => prev.map(p => p.id === prodId ? { ...p, inStock: true } : p));
      setSuccessMsg('تم تعديل حالة الصنف إلى "متوفر بالمخزن 🟢" بنجاح!');
      setTimeout(() => setSuccessMsg(''), 4000);
    } catch (err) {
      console.error('Restock error:', err);
      alert('تم إرسال الطلب، يرجى إعادة تنشيط الصفحة للتأكيد.');
    }
  };

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
            <StatsCards analyticsData={analyticsData} />

            <Row className="g-4 mb-4">
              <Col lg={7}>
                <TopViewedProducts topViewedProducts={topViewedProducts} />
              </Col>
              <Col lg={5}>
                <div className="d-flex flex-column gap-4 h-100">
                  <PopularKeywords sortedSearchQueries={sortedSearchQueries} />
                  <InventoryAlerts outOfStockProducts={outOfStockProducts} handleRestockProduct={handleRestockProduct} />
                </div>
              </Col>
            </Row>

            <AnalyticsDetails analyticsData={analyticsData} lastRefreshedTime={lastRefreshedTime} />
          </>
        ) : null}
      </Container>

      <BulkImportModal 
        showImportModal={showImportModal}
        setShowImportModal={setShowImportModal}
        csvTextContent={csvTextContent}
        setCsvTextContent={setCsvTextContent}
        handleFileUpload={handleFileUpload}
        importing={importing}
        handleExecuteBulkImport={handleExecuteBulkImport}
      />

      <QRCodeGenerator 
        showQRModal={showQRModal}
        setShowQRModal={setShowQRModal}
        qrCodeImageUrl={qrCodeImageUrl}
        siteOrigin={siteOrigin}
      />
    </div>
  );
};

export default OwnerAnalytics;
