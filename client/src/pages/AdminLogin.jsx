import React, { useState } from 'react';
import { Container, Card, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Lock, User, ShieldCheck, KeyRound } from 'lucide-react';
import { adminLogin } from '../services/api';

const AdminLogin = ({ onLoginSuccess, onCancel }) => {
  const [username, setUsername] = useState('admin');
  const [password, setPassword] = useState('admin123');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const res = await adminLogin({ username, password });
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
      <Container style={{ maxWidth: '480px' }}>
        <Card className="border-0 shadow-lg rounded-4 overflow-hidden">
          <div className="bg-dark text-white p-4 text-center border-bottom border-warning border-3">
            <div className="d-inline-flex p-3 bg-warning text-dark rounded-circle mb-3">
              <ShieldCheck size={32} />
            </div>
            <h4 className="fw-bold mb-1">تسجيل دخول الأدمن</h4>
            <p className="text-muted small mb-0">لوحة إدارة أصناف وأسعار المعرض</p>
          </div>

          <Card.Body className="p-4 p-md-5 bg-white">
            {error && <Alert variant="danger" className="rounded-3">{error}</Alert>}

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
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    className="custom-input border-start-0"
                    placeholder="ادخل اسم المستخدم"
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
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="custom-input border-start-0"
                    placeholder="ادخل كلمة المرور"
                  />
                </div>
              </Form.Group>

              <div className="p-3 bg-light rounded-3 mb-4 border">
                <div className="d-flex align-items-center gap-2 text-warning fw-bold small mb-1">
                  <KeyRound size={16} /> بيانات الدخول المفتراضية للأدمن:
                </div>
                <div className="small text-muted">اسم المستخدم: <strong>admin</strong></div>
                <div className="small text-muted">كلمة المرور: <strong>admin123</strong></div>
              </div>

              <Button 
                type="submit" 
                className="admin-btn w-100 py-3 mb-3 fs-6 d-flex align-items-center justify-content-center gap-2"
                disabled={loading}
              >
                {loading ? <Spinner animation="border" size="sm" /> : 'دخول لوحة التحكم'}
              </Button>

              <Button 
                variant="link" 
                className="w-100 text-muted text-decoration-none small"
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
