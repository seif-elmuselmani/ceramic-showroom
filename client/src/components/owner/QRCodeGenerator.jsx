import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { QrCode, Download } from 'lucide-react';

const QRCodeGenerator = ({ showQRModal, setShowQRModal, qrCodeImageUrl, siteOrigin }) => {
  return (
    <Modal show={showQRModal} onHide={() => setShowQRModal(false)} centered className="rounded-4 text-center">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-black text-dark d-flex align-items-center gap-2 fs-5 w-100 justify-content-center">
          <QrCode className="text-warning" size={24} />
          📱 رمز QR Code الملكي للمعرض (Showroom QR)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        <p className="text-muted small fw-bold mb-3">
          اطبع هذا الرمز وضعه في الفروع (بنها - مدخل قبلي / برج السنهوي)، ليمسحه الزبائن بهواتفهم وتصفح الكتالوج بالكامل!
        </p>

        <div className="p-4 bg-white border border-warning rounded-4 d-inline-block shadow-sm mb-3">
          <img src={qrCodeImageUrl} alt="Showroom QR Code" style={{ width: '220px', height: '220px' }} />
        </div>

        <div className="small text-dark font-monospace fw-bold mb-3">
          {siteOrigin}
        </div>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0 justify-content-center">
        <Button 
          variant="warning" 
          className="rounded-pill fw-black text-dark px-4 d-inline-flex align-items-center gap-2"
          onClick={() => window.open(qrCodeImageUrl, '_blank')}
        >
          <Download size={16} /> تحميل الصورة بجودة عالية HD
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default QRCodeGenerator;
