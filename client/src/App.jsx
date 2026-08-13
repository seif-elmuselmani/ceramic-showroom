import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';
import { MessageCircle } from 'lucide-react';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import Contact from './pages/Contact';
import NotFound from './pages/NotFound';
import OwnerAnalytics from './pages/OwnerAnalytics';
import ErrorBoundary from './components/ErrorBoundary';
import ToastNotification from './components/ToastNotification';

import { getSettings, getCategories } from './services/api';
import { initAnalyticsTracker, trackWhatsAppClick } from './services/analytics';

function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [isAdmin, setIsAdmin] = useState(false);
  const [categories, setCategories] = useState([]);
  const [categoryFilter, setCategoryFilter] = useState('الكل');
  const [settings, setSettings] = useState({
    showroomName: 'السيد الجزار للسيراميك والبورسلين',
    whatsappNumber: '201001366499',
    phoneNumber: '01001366499',
    facebookUrl: 'https://www.facebook.com/share/1DMrALiUKx/',
    tiktokUrl: 'https://www.tiktok.com/@ceramicaelgazar?_r=1&_t=ZS-98ZoTHkIMQ0',
    mapUrl: 'https://www.bing.com/maps/search?v=2&pc=FACEBK&mid=8100&mkt=en-US&FORM=FBKPL1&q=%D8%A7%D9%84%D8%B9%D9%86%D9%88%D8%A7%D9%86%3A+%D8%A8%D9%86%D9%87%D8%A7+-%D8%A8%D8%B1%D8%AC+%D8%A7%D9%84%D8%B3%D9%86%D9%87%D9%88%D9%89+%E2%80%93+%D8%A8%D8%AC%D9%88%D8%A7%D8%B1+%D9%83%D9%88%D8%A8%D8%B1%D9%8A+%D8%A7%D9%84%D8%B4%D9%85%D9%88%D8%AA%2C+Benha%2C+Egypt%2C+013&cp=30.460002%7E31.183300&lvl=13.4&style=r',
    address: 'فرع 1: بنها - مدخل بنها القبلي - برج العطار | فرع 2: بنها - برج السنهوي - بجوار كوبري الشموت',
    announcement: '✨ عروض خاصة: خصم 20% على البورسلين الهندي والإسباني 60x120 لفترة محدودة!'
  });

  useEffect(() => {
    // Initialize Telemetry Analytics Tracker
    const cleanupAnalytics = initAnalyticsTracker();

    // Check local authentication status
    const token = localStorage.getItem('ceramic_admin_token');
    if (token) {
      setIsAdmin(true);
    }

    // Check URL parameters for secret owner analytics or 404
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('stats') === 'true' || queryParams.get('analytics') === 'true' || window.location.hash === '#owner-stats') {
      setActiveTab('owner-stats');
    } else if (queryParams.get('page') === '404' || window.location.hash === '#404') {
      setActiveTab('404');
    } else if (queryParams.get('manage') === 'true' || window.location.hash === '#admin-login') {
      setActiveTab('login');
      // Clean up URL parameters/hash to keep it hidden
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchSettings();
    fetchCategories();

    return () => {
      if (cleanupAnalytics) cleanupAnalytics();
    };
  }, []);

  const fetchSettings = async () => {
    try {
      const res = await getSettings();
      if (res.data) {
        setSettings(res.data);
      }
    } catch (err) {
      console.error('Error loading settings:', err);
    }
  };

  const fetchCategories = async () => {
    try {
      const res = await getCategories();
      if (res.data) {
        setCategories(res.data);
      }
    } catch (err) {
      console.error('Error loading categories:', err);
    }
  };

  const handleNavigate = (tab, catName = null) => {
    if (tab === 'admin' && !isAdmin) {
      setActiveTab('login');
      return;
    }
    setActiveTab(tab);
    if (catName) {
      setCategoryFilter(catName);
    }
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleLoginSuccess = () => {
    setIsAdmin(true);
    setActiveTab('admin');
  };

  const handleLogout = () => {
    localStorage.removeItem('ceramic_admin_token');
    setIsAdmin(false);
    setActiveTab('catalog');
  };

  return (
    <ErrorBoundary>
      <div className="d-flex flex-column min-vh-100 position-relative">
        <ToastNotification />
        
        <Navbar 
          settings={settings}
          isAdmin={isAdmin}
          activeTab={activeTab}
          onNavigate={handleNavigate}
          onLogout={handleLogout}
        />

        <main className="flex-grow-1">
          {activeTab === 'catalog' && (
            <Home 
              settings={settings} 
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              mode="catalog"
            />
          )}

          {activeTab === 'featured' && (
            <Home 
              settings={settings} 
              categoryFilter={categoryFilter}
              setCategoryFilter={setCategoryFilter}
              mode="featured"
            />
          )}

          {activeTab === 'owner-stats' && (
            <OwnerAnalytics />
          )}

          {activeTab === 'contact' && (
            <Contact settings={settings} />
          )}

          {activeTab === '404' && (
            <NotFound onNavigate={handleNavigate} settings={settings} />
          )}

          {activeTab === 'login' && (
            <AdminLogin 
              onLoginSuccess={handleLoginSuccess}
              onCancel={() => setActiveTab('catalog')}
            />
          )}

          {activeTab === 'admin' && (
            isAdmin ? (
              <AdminDashboard 
                settings={settings}
                onSettingsUpdated={(newSettings) => setSettings(newSettings)}
              />
            ) : (
              <AdminLogin 
                onLoginSuccess={handleLoginSuccess}
                onCancel={() => setActiveTab('catalog')}
              />
            )
          )}
        </main>

        {/* Floating Luxury Showroom WhatsApp Concierge Badge (General Showroom Inquiry) */}
        <a 
          href={`https://wa.me/${settings?.whatsappNumber || '201001366499'}?text=${encodeURIComponent('السلام عليكم ورحمة الله وبركاته 💐\nمرحباً معرض السيد الجزار للسيراميك والبورسلين 🏛️\n\nأود الاستفسار عن كشف الأسعار والعروض المتاحة حالياً، ومواعيد إمكانية زيارة المعرض لمعاينة العينات. 🙏✨')}`}
          target="_blank"
          rel="noopener noreferrer"
          onClick={() => trackWhatsAppClick('floating_badge')}
          className="floating-whatsapp-luxury"
          title="تواصل مباشر واستفسار عام مع المعرض عبر الواتساب"
        >
          <div className="whatsapp-badge-icon shadow-lg">
            <MessageCircle size={26} />
            <span className="gold-ping-dot"></span>
          </div>
          <span className="whatsapp-badge-text fw-bold text-nowrap d-none d-md-inline">
            💬 استفسار عام مع المعرض
          </span>
        </a>

        <Footer settings={settings} onNavigate={handleNavigate} categories={categories} />
      </div>
    </ErrorBoundary>
  );
}

export default App;
