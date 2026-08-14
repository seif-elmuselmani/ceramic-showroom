import React from 'react';
import { Modal, Form, Button, Alert, Spinner } from 'react-bootstrap';
import { Upload } from 'lucide-react';

const BulkImportModal = ({
  showImportModal,
  setShowImportModal,
  csvTextContent,
  setCsvTextContent,
  handleFileUpload,
  importing,
  handleExecuteBulkImport
}) => {
  return (
    <Modal show={showImportModal} onHide={() => setShowImportModal(false)} centered size="lg" className="rounded-4">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-black text-dark d-flex align-items-center gap-2 fs-5">
          <Upload className="text-warning" size={24} />
          ⚡ أداة استيراد وتحديث المنتجات من إكسيل (Bulk Import)
        </Modal.Title>
      </Modal.Header>
      <Modal.Body className="py-4">
        <Alert variant="info" className="rounded-3 small fw-bold mb-3 border-info">
          💡 يمكنك رفع ملف CSV المستخرج من Excel أو تصدير المعرض السريع. ستقوم الأداة بمطابقة الأصناف بكود الصنف وتحديث الأسعار أو إضافة الأصناف الجديدة تلقائياً!
        </Alert>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold text-dark">اختر ملف CSV من جهازك:</Form.Label>
          <Form.Control type="file" accept=".csv,text/csv" onChange={handleFileUpload} className="rounded-3" />
        </Form.Group>

        <Form.Group className="mb-3">
          <Form.Label className="fw-bold text-dark">أو قم بلصق نص محتوى CSV هنا مباشرة:</Form.Label>
          <Form.Control 
            as="textarea" 
            rows={6} 
            value={csvTextContent}
            onChange={(e) => setCsvTextContent(e.target.value)}
            placeholder={`ID,"كود الصنف","اسم الصنف","الفئة الرئيسية","الفئة الفرعية","الماركة","السعر الحالي"\n"1","ESP-60120","بورسلين إسباني كالاكاتا","بورسلين مستورد","إسباني","Porcelanosa","650"`}
            className="rounded-3 fs-7 font-monospace"
          />
        </Form.Group>
      </Modal.Body>
      <Modal.Footer className="border-0 pt-0">
        <Button variant="outline-secondary" className="rounded-pill fw-bold" onClick={() => setShowImportModal(false)}>
          إلغاء
        </Button>
        <Button 
          variant="warning" 
          className="rounded-pill fw-black text-dark px-4"
          disabled={importing || !csvTextContent.trim()}
          onClick={handleExecuteBulkImport}
        >
          {importing ? <Spinner animation="border" size="sm" /> : '🚀 بدء الاستيراد بنقرة واحدة'}
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default BulkImportModal;
