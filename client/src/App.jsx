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

import { getSettings } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [isAdmin, setIsAdmin] = useState(false);
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
    // Check local authentication status
    const token = localStorage.getItem('ceramic_admin_token');
    if (token) {
      setIsAdmin(true);
    }

    // Check if the URL has ?manage=true or hash is #admin-login to trigger secret login page
    const queryParams = new URLSearchParams(window.location.search);
    if (queryParams.get('manage') === 'true' || window.location.hash === '#admin-login') {
      setActiveTab('login');
      // Clean up URL parameters/hash to keep it hidden
      window.history.replaceState({}, document.title, window.location.pathname);
    }

    fetchSettings();
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

  const handleNavigate = (tab) => {
    if (tab === 'admin' && !isAdmin) {
      setActiveTab('login');
      return;
    }
    setActiveTab(tab);
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
    <div className="d-flex flex-column min-vh-100 position-relative">
      <Navbar 
        settings={settings}
        isAdmin={isAdmin}
        activeTab={activeTab}
        onNavigate={handleNavigate}
        onLogout={handleLogout}
      />

      <main className="flex-grow-1">
        {activeTab === 'catalog' && (
          <Home settings={settings} />
        )}

        {activeTab === 'featured' && (
          <Home settings={settings} />
        )}

        {activeTab === 'contact' && (
          <Contact settings={settings} />
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

      {/* Floating WhatsApp Action Button for Mobile Users */}
      <a 
        href={`https://wa.me/${settings?.whatsappNumber || '201223817860'}?text=${encodeURIComponent('مرحباً، أستفسر عن أصناف السيراميك والبورسلين بالمعرض')}`}
        target="_blank"
        rel="noopener noreferrer"
        className="floating-whatsapp-btn"
        title="تواصل مباشر عبر الواتساب"
      >
        <MessageCircle size={30} />
      </a>

      <Footer settings={settings} onNavigate={handleNavigate} />
    </div>
  );
}

export default App;
