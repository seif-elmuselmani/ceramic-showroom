import React from 'react';
import { Modal, Form, Button } from 'react-bootstrap';
import { DollarSign } from 'lucide-react';

const AdminPriceModal = ({ showPriceModal, setShowPriceModal, priceProduct, newOriginalPrice, setNewOriginalPrice, newPrice, setNewPrice, handleSavePrice }) => {
  return (
<>
      <Modal show={showPriceModal} onHide={() => setShowPriceModal(false)} centered size="sm">
        <Modal.Header closeButton>
          <Modal.Title className="fw-bold fs-6">تحديث السعر</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {priceProduct && (
            <div>
              <p className="small text-muted mb-3">الصنف: <strong className="text-dark">{priceProduct.name}</strong></p>
              
              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-secondary">السعر الأساسي (قبل الخصم):</Form.Label>
                <Form.Control
                  type="number"
                  step="0.5"
                  placeholder="اتركه فارغاً إن لم يكن هناك خصم"
                  value={newOriginalPrice}
                  onChange={(e) => setNewOriginalPrice(e.target.value)}
                  className="custom-input text-muted"
                />
              </Form.Group>

              <Form.Group className="mb-3">
                <Form.Label className="small fw-bold text-success">السعر النهائي (بعد الخصم):</Form.Label>
                <Form.Control
                  type="number"
                  step="0.5"
                  value={newPrice}
                  onChange={(e) => setNewPrice(e.target.value)}
                  className="custom-input fs-5 fw-bold text-success"
                  autoFocus
                />
              </Form.Group>

              {newOriginalPrice && newPrice && Number(newOriginalPrice) > Number(newPrice) && (
                <div className="p-2 bg-success bg-opacity-10 border border-success border-opacity-25 rounded-3 text-center text-success small fw-bold">
                  ✨ خصم {Math.round(((Number(newOriginalPrice) - Number(newPrice)) / Number(newOriginalPrice)) * 100)}%- | وفرت {(Number(newOriginalPrice) - Number(newPrice)).toLocaleString()} ج.م
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" size="sm" onClick={() => setShowPriceModal(false)}>إلغاء</Button>
          <Button variant="success" size="sm" onClick={handleSavePrice} className="px-3 fw-bold">تحديث السعر</Button>
        </Modal.Footer>
      </Modal>

      {/* Add / Edit Category Modal */}
</>
  );
};
export default AdminPriceModal;