import React from 'react';
import { Modal, Form, InputGroup, Button, Badge } from 'react-bootstrap';
import { Layers, PlusCircle, Save, Trash2 } from 'lucide-react';

const AdminCategoryModal = ({ showCategoryModal, setShowCategoryModal, editingCategory, categoryFormData, setCategoryFormData, newSubcategory, setNewSubcategory, handleAddSubcategory, handleRemoveSubcategory, handleCategorySubmit }) => {
  return (
<>
      <Modal show={showCategoryModal} onHide={() => setShowCategoryModal(false)} centered className="modal-luxury">
        <Modal.Header closeButton className="bg-dark text-white border-bottom border-warning">
          <Modal.Title className="fw-bold fs-6">
            {editingCategory ? `تعديل التصنيف: ${editingCategory.name}` : 'إضافة تصنيف جديد للمعرض'}
          </Modal.Title>
        </Modal.Header>

        <Form onSubmit={handleCategorySubmit}>
          <Modal.Body className="p-3">
            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">اسم التصنيف</Form.Label>
              <Form.Control
                type="text"
                required
                value={categoryFormData.name}
                onChange={(e) => setCategoryFormData({ ...categoryFormData, name: e.target.value })}
                className="custom-input"
                placeholder="مثال: بورسلين مستورد"
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label className="fw-bold">الفئات الفرعية (Subcategories)</Form.Label>
              <InputGroup className="mb-2">
                <Form.Control
                  type="text"
                  value={newSubcategory}
                  onChange={(e) => setNewSubcategory(e.target.value)}
                  className="custom-input"
                  placeholder="اكتب فئة فرعية واضغط إضافة (مثال: إسباني)"
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') {
                      e.preventDefault();
                      handleAddSubcategory();
                    }
                  }}
                />
                <Button variant="warning" className="text-dark fw-bold" onClick={handleAddSubcategory}>إضافة</Button>
              </InputGroup>

              <div className="d-flex flex-wrap gap-2 mt-2 bg-light p-2 rounded border" style={{ minHeight: '50px' }}>
                {categoryFormData.subcategories.length === 0 ? (
                  <span className="text-muted small my-auto">لا توجد فئات فرعية مضافة حتى الآن. اكتب بالأعلى واضغط إضافة.</span>
                ) : (
                  categoryFormData.subcategories.map((sub, idx) => (
                    <Badge key={idx} bg="info" className="text-dark bg-opacity-25 p-2 d-flex align-items-center gap-2">
                      {sub}
                      <span 
                        style={{ cursor: 'pointer', fontWeight: 'bold' }} 
                        className="text-danger ml-1" 
                        onClick={() => handleRemoveSubcategory(sub)}
                        title="إزالة"
                      >
                        ×
                      </span>
                    </Badge>
                  ))
                )}
              </div>
            </Form.Group>
          </Modal.Body>

          <Modal.Footer className="bg-light p-2">
            <Button variant="secondary" size="sm" onClick={() => setShowCategoryModal(false)}>إلغاء</Button>
            <Button type="submit" className="admin-btn px-4 py-2">
              {editingCategory ? 'حفظ التعديلات' : 'إنشاء التصنيف'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
</>
  );
};
export default AdminCategoryModal;