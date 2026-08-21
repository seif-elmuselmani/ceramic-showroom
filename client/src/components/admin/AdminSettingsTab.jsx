import React from 'react';
import { Card, Form, Button } from 'react-bootstrap';
import { Settings } from 'lucide-react';

const AdminSettingsTab = ({ settingsForm, setSettingsForm, handleSettingsSubmit }) => {
  return (
            <Card className="admin-card" style={{ maxWidth: '700px' }}>
              <h4 className="fw-bold mb-3 d-flex align-items-center gap-2">
                <Settings className="text-warning" size={24} />
                بيانات المعرض والواتساب
              </h4>
              <Form onSubmit={handleSettingsSubmit}>
                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">اسم المعرض الرسمي</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.showroomName || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, showroomName: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">الشعار والوصف الفرعي للمجال</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.tagline || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tagline: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رقم الواتساب للطلبات المباشرة (صيغة دولية بدون +)</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.whatsappNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, whatsappNumber: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: 201012345678"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رقم الهاتف الأرضي/المحمول للمبيعات</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.phoneNumber || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, phoneNumber: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رابط صفحة فيسبوك المعرض (Facebook Page Link)</Form.Label>
                  <Form.Control
                    type="url"
                    value={settingsForm.facebookUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, facebookUrl: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: https://www.facebook.com/..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رابط تيك توك المعرض (TikTok Profile Link)</Form.Label>
                  <Form.Control
                    type="url"
                    value={settingsForm.tiktokUrl || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, tiktokUrl: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: https://www.tiktok.com/@..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">عنوان الفرع 1 (مدخل بنها القبلي - برج العطار)</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.address1 || ''}
                    onChange={(e) => {
                      const addr1 = e.target.value;
                      const addr2 = settingsForm.address2 || '';
                      setSettingsForm({ 
                        ...settingsForm, 
                        address1: addr1,
                        address: `فرع 1: ${addr1} | فرع 2: ${addr2}` 
                      });
                    }}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">عنوان الفرع 2 (برج السنهوي - كوبري الشموت)</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.address2 || ''}
                    onChange={(e) => {
                      const addr1 = settingsForm.address1 || '';
                      const addr2 = e.target.value;
                      setSettingsForm({ 
                        ...settingsForm, 
                        address2: addr2,
                        address: `فرع 1: ${addr1} | فرع 2: ${addr2}` 
                      });
                    }}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رابط الخريطة الجغرافية للفرع 1 (مدخل بنها القبلي - برج العطار)</Form.Label>
                  <Form.Control
                    type="url"
                    value={settingsForm.mapUrl1 || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl1: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: https://www.google.com/maps/..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">رابط الخريطة الجغرافية للفرع 2 (برج السنهوي - كوبري الشموت)</Form.Label>
                  <Form.Control
                    type="url"
                    value={settingsForm.mapUrl2 || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, mapUrl2: e.target.value })}
                    className="custom-input"
                    placeholder="مثال: https://www.bing.com/maps/..."
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">أوقات وساعات العمل</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.workingHours || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, workingHours: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Form.Group className="mb-3">
                  <Form.Label className="fw-bold">شريط الإعلانات والخصومات العلوية</Form.Label>
                  <Form.Control
                    type="text"
                    value={settingsForm.announcement || ''}
                    onChange={(e) => setSettingsForm({ ...settingsForm, announcement: e.target.value })}
                    className="custom-input"
                  />
                </Form.Group>

                <Button type="submit" className="admin-btn py-2 px-4 mt-2">
                  حفظ إعدادات المعرض
                </Button>
              </Form>
            </Card>
  );
};

export default AdminSettingsTab;
