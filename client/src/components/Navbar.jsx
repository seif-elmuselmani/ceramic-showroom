import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Layers, LogOut, LayoutDashboard, UserCheck, Megaphone } from 'lucide-react';

const Header = ({ settings, isAdmin, onNavigate, activeTab, onLogout }) => {
  return (
    <header className="sticky-top">
      {/* Announcement Bar */}
      {settings?.announcement && (
        <div className="announcement-bar d-flex justify-content-center align-items-center px-3 py-3 text-center">
          <div className="d-flex align-items-center gap-2 justify-content-center">
            <Megaphone size={20} className="text-warning animate-pulse flex-shrink-0" />
            <span className="announcement-text" style={{ fontSize: '0.98rem' }}>{settings.announcement}</span>
          </div>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="luxury-navbar">
        <Container>
          <Navbar.Brand 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}
            className="brand-logo d-flex align-items-center gap-2"
          >
            <img 
              src="/Logo.png" 
              alt={settings?.showroomName || 'معرض السيراميك والبورسلين'} 
              style={{ width: '45px', height: '45px', objectFit: 'cover', borderRadius: '50%', border: '2px solid var(--primary-gold)' }} 
            />
            <div>
              <div className="fw-black">{settings?.showroomName || 'معرض السيراميك والبورسلين'}</div>
              <div style={{ fontSize: '0.7rem', fontWeight: '400', color: '#c5a059' }}>
                كتالوج أصناف وأسعار المعرض
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="luxury-nav" className="border-warning p-2" />
          
          <Navbar.Collapse id="luxury-nav" className="navbar-collapse-custom">
            <Nav className="mx-auto my-2 my-lg-0">
              <Nav.Link 
                className={`nav-link-custom ${activeTab === 'catalog' ? 'active' : ''}`}
                onClick={() => onNavigate('catalog')}
              >
                كتالوج المنتجات
              </Nav.Link>
              <Nav.Link 
                className={`nav-link-custom ${activeTab === 'featured' ? 'active' : ''}`}
                onClick={() => onNavigate('featured')}
              >
                أحدث الأصناف
              </Nav.Link>
              <Nav.Link 
                className={`nav-link-custom ${activeTab === 'contact' ? 'active' : ''}`}
                onClick={() => onNavigate('contact')}
              >
                العنوان والتواصل
              </Nav.Link>
            </Nav>

            <div className="d-flex align-items-center gap-2 mt-3 mt-lg-0">
              {isAdmin && (
                <>
                  <Button 
                    variant="outline-warning" 
                    className="d-flex align-items-center justify-content-center gap-2 rounded-pill px-3 py-2 w-100 w-lg-auto"
                    onClick={() => onNavigate('admin')}
                  >
                    <LayoutDashboard size={18} />
                    لوحة التحكم
                  </Button>
                  <Button 
                    variant="outline-danger" 
                    className="rounded-circle p-2"
                    title="تسجيل الخروج"
                    onClick={onLogout}
                  >
                    <LogOut size={18} />
                  </Button>
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
