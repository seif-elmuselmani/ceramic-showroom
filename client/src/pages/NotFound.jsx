import React from 'react';
import { Container, Button, Card, Badge } from 'react-bootstrap';
import { Home, PhoneCall, AlertCircle, Sparkles, Layers } from 'lucide-react';

const NotFound = ({ onNavigate, settings }) => {
  const whatsappNumber = settings?.whatsappNumber || '201001366499';

  return (
    <Container className="py-5 my-4">
      <Card className="border-0 rounded-4 shadow-lg overflow-hidden text-center p-4 p-md-5 max-w-2xl mx-auto bg-white">
        <div className="mb-4 d-inline-flex align-items-center justify-content-center p-4 rounded-circle bg-warning bg-opacity-10 border border-warning border-opacity-25 mx-auto">
          <AlertCircle size={64} className="text-warning animate-bounce" />
        </div>

        <Badge bg="dark" className="px-3 py-2 fs-6 rounded-pill mx-auto mb-3 text-warning border border-warning" style={{ width: 'fit-content' }}>
          404 - الصفحة غير موجودة
        </Badge>

        <h1 className="fw-black text-dark display-5 mb-3">
          عفواً! الرابط المطلوب غير متوفر
        </h1>

        <p className="text-muted fs-5 mb-4 lead" style={{ maxWidth: '600px', margin: '0 auto' }}>
          يبدو أن الصفحة التي تحاول الوصول إليها قد تم نقلها، أو أن كود الصنف غير صحيح. يمكنك العودة فوراً واستكشاف كتالوج السيراميك والبورسلين.
        </p>

        <div className="d-flex flex-wrap justify-content-center gap-3 mt-2">
          <Button 
            className="admin-btn py-3 px-4 fs-6 rounded-pill d-flex align-items-center gap-2"
            onClick={() => {
              if (onNavigate) onNavigate('catalog');
            }}
          >
            <Home size={20} />
            العودة للكتالوج الرئيسي
          </Button>

          <a 
            href={`https://wa.me/${whatsappNumber}?text=${encodeURIComponent('مرحباً، أستفسر عن صنف سيراميك/بورسلين يبدو أنه غير متوفر بالرابط')}`}
            target="_blank"
            rel="noopener noreferrer"
            className="btn btn-outline-dark rounded-pill py-3 px-4 fw-bold fs-6 d-flex align-items-center gap-2 border-2"
          >
            <PhoneCall size={20} className="text-success" />
            استفسر عبر الواتساب مباشرة
          </a>
        </div>

        <div className="mt-5 pt-4 border-top text-muted small d-flex align-items-center justify-content-center gap-2">
          <Sparkles size={16} className="text-warning" />
          <span>{settings?.showroomName || 'السيد الجزار للسيراميك والبورسلين'} - جودة وفخامة لا تتكرر</span>
        </div>
      </Card>
    </Container>
  );
};

export default NotFound;
