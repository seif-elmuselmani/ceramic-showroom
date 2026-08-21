import React from 'react';
import { Card, Button, Table, Badge } from 'react-bootstrap';
import { Layers, PlusCircle, Edit, Trash2 } from 'lucide-react';

const AdminCategoriesTab = ({ categories, handleOpenCategoryModal, handleDeleteCategory }) => {
  return (
            <Card className="admin-card">
              <div className="d-flex justify-content-between align-items-center mb-4">
                <h4 className="fw-bold mb-0 d-flex align-items-center gap-2">
                  <Layers className="text-warning" size={24} />
                  إدارة التصنيفات والفئات الفرعية
                </h4>
                <Button 
                  variant="warning" 
                  className="fw-bold text-dark d-flex align-items-center gap-2"
                  onClick={() => handleOpenCategoryModal()}
                >
                  <PlusCircle size={18} /> إضافة تصنيف جديد
                </Button>
              </div>

              <div className="table-responsive">
                <Table hover className="table-custom">
                  <thead>
                    <tr>
                      <th style={{ width: '120px' }}>الأيقونة</th>
                      <th>اسم التصنيف</th>
                      <th>الفئات الفرعية</th>
                      <th className="text-center" style={{ width: '200px' }}>الإجراءات</th>
                    </tr>
                  </thead>
                  <tbody>
                    {categories.length === 0 ? (
                      <tr>
                        <td colSpan="4" className="text-center py-4 text-muted">
                          لا توجد تصنيفات حالية.
                        </td>
                      </tr>
                    ) : (
                      categories.map((cat) => (
                        <tr key={cat.id}>
                          <td>
                            <Badge bg="light" className="text-dark border p-2 d-flex align-items-center justify-content-center gap-2" style={{ width: 'fit-content' }}>
                              <Layers size={16} className="text-warning" />
                              <code>{cat.icon || 'Layers'}</code>
                            </Badge>
                          </td>
                          <td>
                            <strong className="text-dark fs-6">{cat.name}</strong>
                          </td>
                          <td>
                            <div className="d-flex flex-wrap gap-1">
                              {cat.subcategories && cat.subcategories.length > 0 ? (
                                cat.subcategories.map((sub, sIdx) => (
                                  <Badge key={sIdx} bg="info" className="text-dark bg-opacity-25">
                                    {sub}
                                  </Badge>
                                ))
                              ) : (
                                <span className="text-muted small">لا توجد فئات فرعية مضافة</span>
                              )}
                            </div>
                          </td>
                          <td>
                            <div className="d-flex justify-content-center gap-2">
                              <Button 
                                size="sm" 
                                variant="outline-primary"
                                onClick={() => handleOpenCategoryModal(cat)}
                                title="تعديل التصنيف والفئات الفرعية"
                              >
                                <Edit size={16} /> تعديل
                              </Button>
                              <Button 
                                size="sm" 
                                variant="outline-danger"
                                onClick={() => handleDeleteCategory(cat)}
                                title="حذف التصنيف"
                              >
                                <Trash2 size={16} /> حذف
                              </Button>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </Table>
              </div>
            </Card>
  );
};

export default AdminCategoriesTab;
