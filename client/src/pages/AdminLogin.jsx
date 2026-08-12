import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { adminLogin } from '../services/api';

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!username.trim() || !password.trim()) {
      setError('يرجى كتابة اسم المستخدم وكلمة المرور كاملاً.');
      return;
    }

    setError('');
    setLoading(true);

    try {
      const res = await adminLogin({ username: username.trim(), password: password.trim() });
      localStorage.setItem('ceramic_admin_token', res.data.token);
      onLoginSuccess();
    } catch (err) {
      console.error('Login error:', err);
      setError(err.response?.data?.message || 'اسم المستخدم أو كلمة المرور غير صحيحة');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="py-5" style={{ minHeight: '80vh', display: 'flex', alignItems: 'center' }}>
      <Container style={{ maxWidth: '440px' }}>
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="bg-dark text-white p-4 text-center border-bottom border-warning border-3">
            <div className="d-inline-flex p-3 bg-warning text-dark rounded-circle mb-3 shadow-sm">
              <ShieldCheck size={32} />
            </div>
            <h4 className="fw-bold mb-1">تسجيل دخول الأدمن</h4>
            <p className="text-light opacity-75 small mb-0">لوحة إدارة أصناف وأسعار المعرض</p>
          </div>

          <Card.Body className="p-4 p-md-5 bg-white">
            {error && <Alert variant="danger" className="rounded-3 fs-6 py-2.5">{error}</Alert>}

            <Form onSubmit={handleSubmit}>
              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-dark">اسم المستخدم</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <User size={18} className="text-muted" />
                  </span>
                  <Form.Control
                    type="text"
                    required
                    autoFocus
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="custom-input border-start-0"
                    placeholder="ادخل اسم المستخدم المحمي..."
                  />
                </div>
              </Form.Group>

              <Form.Group className="mb-4">
                <Form.Label className="fw-bold text-dark">كلمة المرور</Form.Label>
                <div className="input-group">
                  <span className="input-group-text bg-light border-end-0">
                    <Lock size={18} className="text-muted" />
                  </span>
                  <Form.Control
                    type={showPassword ? "text" : "password"}
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="custom-input border-start-0 border-end-0"
                    placeholder="ادخل كلمة المرور السريّة..."
                  />
                  <Button 
                    variant="outline-secondary" 
                    className="bg-light border-start-0 border text-muted"
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    title={showPassword ? "إخفاء كلمة المرور" : "إظهار كلمة المرور"}
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </Button>
                </div>
              </Form.Group>

              <Button 
                type="submit" 
                className="admin-btn w-100 py-3 mb-3 fs-6 d-flex align-items-center justify-content-center gap-2 rounded-pill fw-bold shadow-sm"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'دخول لوحة التحكم 🔒'}
              </Button>

              <Button 
                variant="link" 
                className="w-100 text-muted text-decoration-none small fw-bold"
                onClick={onCancel}
              >
                العودة للكتالوج الرئيسي
              </Button>
            </Form>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default AdminLogin;
