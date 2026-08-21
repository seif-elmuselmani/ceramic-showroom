const fs = require('fs');

let content = fs.readFileSync('client/src/components/admin/modals/AdminProductModal.jsx', 'utf8');

const newVariantsUX = `                    {formData.hasVariants && (
                      <div className="mt-3">
                        <div className="table-responsive bg-white rounded-3 border">
                          <table className="table table-hover table-sm align-middle text-center mb-0">
                            <thead className="table-light">
                              <tr>
                                <th>#</th>
                                <th>اللون</th>
                                <th>نوع الغطاء</th>
                                <th>السعر</th>
                                <th>السعر القديم</th>
                                <th>صورة مخصصة</th>
                                <th></th>
                              </tr>
                            </thead>
                            <tbody>
                              {formData.variants.length === 0 ? (
                                <tr>
                                  <td colSpan="7" className="text-muted py-4 border-dashed">لم تقم بإضافة أي خيارات بعد.</td>
                                </tr>
                              ) : (
                                formData.variants.map((vItem, vIdx) => (
                                  <tr key={vItem.id || vIdx}>
                                    <td><Badge bg="dark" className="rounded-circle">{vIdx + 1}</Badge></td>
                                    <td>
                                      <Form.Control size="sm" type="text" placeholder="اللون..." value={vItem.color || ''} onChange={(e) => handleUpdateVariant(vIdx, 'color', e.target.value)} className="fs-8" />
                                    </td>
                                    <td>
                                      <Form.Control size="sm" type="text" placeholder="الغطاء..." value={vItem.coverType || ''} onChange={(e) => handleUpdateVariant(vIdx, 'coverType', e.target.value)} className="fs-8" />
                                    </td>
                                    <td style={{width: '90px'}}>
                                      <Form.Control size="sm" type="number" placeholder="0" value={vItem.price || ''} onChange={(e) => handleUpdateVariant(vIdx, 'price', e.target.value)} className="fs-8 text-success fw-bold" />
                                    </td>
                                    <td style={{width: '90px'}}>
                                      <Form.Control size="sm" type="number" placeholder="0" value={vItem.originalPrice || ''} onChange={(e) => handleUpdateVariant(vIdx, 'originalPrice', e.target.value)} className="fs-8 text-muted" />
                                    </td>
                                    <td style={{width: '120px'}}>
                                      <Form.Control size="sm" type="text" placeholder="رابط الصورة" value={vItem.image || ''} onChange={(e) => handleUpdateVariant(vIdx, 'image', e.target.value)} className="fs-8" />
                                    </td>
                                    <td>
                                      <Button size="sm" variant="outline-danger" className="p-1 rounded-circle" onClick={() => handleRemoveVariant(vIdx)} title="حذف"><Trash2 size={14} /></Button>
                                    </td>
                                  </tr>
                                ))
                              )}
                            </tbody>
                          </table>
                        </div>
                        <Button size="sm" variant="warning" onClick={handleAddVariant} className="fw-bold mt-2 text-dark">
                          + إضافة خيار جديد
                        </Button>
                      </div>
                    )}`;

const startIndex = content.indexOf('{formData.hasVariants && (');
const endIndex = content.indexOf('                  </div>\n                </Col>\n\n              <Col md={12}>');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newVariantsUX + '\n' + content.substring(endIndex);
  fs.writeFileSync('client/src/components/admin/modals/AdminProductModal.jsx', content);
  console.log("Variant UX replaced successfully!");
} else {
  console.log("Could not find blocks!");
}
