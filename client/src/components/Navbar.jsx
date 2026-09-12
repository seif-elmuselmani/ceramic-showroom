import React from 'react';
import { Navbar, Container } from 'react-bootstrap';
import { Layers, LogOut, LayoutDashboard, Megaphone, Menu, Sparkles, PhoneCall } from 'lucide-react';

const Header = ({ settings, isAdmin, onNavigate, activeTab, onLogout }) => {
  return (
    <header className="sticky-top">
      {/* Announcement Bar */}
      {settings?.announcement && (
        <div className="luxury-announcement-bar d-flex justify-content-center align-items-center">
          <div className="d-flex align-items-center gap-2 justify-content-center">
            <Megaphone size={18} className="animate-pulse flex-shrink-0" />
            <span className="announcement-text">{settings.announcement}</span>
          </div>
        </div>
      )}

      {/* Main Luxury Glass Navbar */}
      <Navbar expand="lg" className="glass-navbar py-2.5">
        <Container>
          {/* Brand Logo & Name */}
          <Navbar.Brand 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}
            className="brand-logo d-flex align-items-center gap-2.5 text-decoration-none"
          >
            <div className="brand-logo-ring">
              <img 
                src="/Logo.png" 
                alt={settings?.showroomName || 'معرض السيد الجزار'} 
                className="brand-logo-img"
              />
            </div>
            <div className="d-flex flex-column text-end">
              <span className="brand-title-luxury">{settings?.showroomName || 'معرض السيد الجزار'}</span>
              <span className="brand-subtitle-luxury">صرح السيراميك والبورسلين والأدوات الصحية</span>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle 
            aria-controls="luxury-nav" 
            className="border-0 p-2 shadow-none rounded-3"
            style={{ background: '#f8fafc', border: '1.5px solid #e2e8f0' }}
          >
            <Menu size={24} className="text-dark fw-bold" />
          </Navbar.Toggle>
          
          <Navbar.Collapse id="luxury-nav" className="navbar-collapse-custom">
            {/* Center Floating Glass Capsule Navigation Dock */}
            <div className="nav-capsule-dock mx-auto my-2 my-lg-0">
              <button 
                type="button"
                className={`nav-capsule-item ${activeTab === 'catalog' ? 'active' : ''}`}
                onClick={() => onNavigate('catalog')}
              >
                <Layers size={16} className="nav-item-icon" />
                <span>الكتالوج العام</span>
              </button>
              <button 
                type="button"
                className={`nav-capsule-item ${activeTab === 'featured' ? 'active' : ''}`}
                onClick={() => onNavigate('featured')}
              >
                <Sparkles size={16} className="nav-item-icon text-warning" />
                <span>أحدث الموديلات</span>
              </button>
              <button 
                type="button"
                className={`nav-capsule-item ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => onNavigate('contact')}
              >
                <PhoneCall size={16} className="nav-item-icon text-success" />
                <span>العنوان والتواصل</span>
              </button>
            </div>

            {/* Left Action Buttons */}
            <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0 justify-content-center justify-content-lg-start">
              {/* WhatsApp Quick VIP Consultation Button */}
              <a 
                href={`https://wa.me/${settings?.whatsappNumber || '201012345678'}?text=${encodeURIComponent('مرحباً، أود الاستفسار عن عروض وتصاميم المعرض')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-nav-gold d-inline-flex align-items-center gap-2 text-decoration-none"
              >
                <PhoneCall size={16} />
                <span>تواصل مع المعرض</span>
              </a>

              {isAdmin && (
                <>
                  <button 
                    className="btn btn-luxury-dark d-flex align-items-center justify-content-center gap-2"
                    onClick={() => onNavigate('admin')}
                  >
                    <LayoutDashboard size={17} />
                    <span>لوحة التحكم</span>
                  </button>
                  <button 
                    className="btn btn-luxury-ghost-danger rounded-circle p-2 d-flex align-items-center justify-content-center"
                    title="تسجيل الخروج"
                    onClick={onLogout}
                  >
                    <LogOut size={17} />
                  </button>
                </>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
