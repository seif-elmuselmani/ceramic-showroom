import React, { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/App.css';

import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';

import { getSettings } from './services/api';

function App() {
  const [activeTab, setActiveTab] = useState('catalog');
  const [isAdmin, setIsAdmin] = useState(false);
  const [settings, setSettings] = useState({
    showroomName: 'معرض السيراميك والبورسلين',
    whatsappNumber: '201000000000',
    phoneNumber: '01000000000',
    address: 'القاهرة - شارع مكرم عبيد - مدينة نصر',
    announcement: '🔥 خصومات تصل إلى 25% على البورسلين المستورد لفترة محدودة!'
  });

  useEffect(() => {
    // Check local authentication status
    const token = localStorage.getItem('ceramic_admin_token');
    if (token) {
      setIsAdmin(true);
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
    if (tab === 'contact') {
      setActiveTab('catalog');
      setTimeout(() => {
        const elem = document.getElementById('contact-section');
        if (elem) elem.scrollIntoView({ behavior: 'smooth' });
      }, 100);
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
    <div className="d-flex flex-column min-vh-100">
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

      <Footer settings={settings} />
    </div>
  );
}

export default App;
