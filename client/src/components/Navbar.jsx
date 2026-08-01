import React from 'react';
import { Navbar, Container, Nav, Button } from 'react-bootstrap';
import { Layers, ShieldCheck, PhoneCall, LogOut, LayoutDashboard, UserCheck } from 'lucide-react';

const Header = ({ settings, isAdmin, onNavigate, activeTab, onLogout }) => {
  return (
    <header className="sticky-top">
      {/* Announcement Bar */}
      {settings?.announcement && (
        <div className="announcement-bar">
          <span>{settings.announcement}</span>
        </div>
      )}

      {/* Main Navbar */}
      <Navbar bg="dark" variant="dark" expand="lg" className="luxury-navbar">
        <Container>
          <Navbar.Brand 
            href="#" 
            onClick={(e) => { e.preventDefault(); onNavigate('catalog'); }}
            className="brand-logo"
          >
            <Layers className="text-warning" size={32} />
            <div>
              <div>{settings?.showroomName || 'معرض السيراميك والبورسلين'}</div>
              <div style={{ fontSize: '0.75rem', fontWeight: '400', color: '#c5a059' }}>
                كتالوج الأصناف والأسعار المحدثة
              </div>
            </div>
          </Navbar.Brand>

          <Navbar.Toggle aria-controls="luxury-nav" />
          <Navbar.Collapse id="luxury-nav">
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

            <div className="d-flex align-items-center gap-2">
              {isAdmin ? (
                <>
                  <Button 
                    variant="outline-warning" 
                    className="d-flex align-items-center gap-2 rounded-pill px-3"
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
              ) : (
                <Button 
                  className="admin-btn d-flex align-items-center gap-2"
                  onClick={() => onNavigate('login')}
                >
                  <UserCheck size={18} />
                  دخول الأدمن
                </Button>
              )}
            </div>
          </Navbar.Collapse>
        </Container>
      </Navbar>
    </header>
  );
};

export default Header;
