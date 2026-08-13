import React, { useState } from 'react';
import { Modal, Form, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Calculator, MessageCircle, Sparkles, Box, Check, HelpCircle } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';

const TileCalculatorModal = ({ product, show, onHide, settings }) => {
  const [length, setLength] = useState('4');
  const [width, setWidth] = useState('5');
  const [wastePercent, setWastePercent] = useState('10'); // 5% straight, 10% diagonal/pattern

  if (!product) return null;

  const lenNum = parseFloat(length) || 0;
  const widNum = parseFloat(width) || 0;
  const wasteNum = parseFloat(wastePercent) || 0;

  // Area Calculation
  const netArea = lenNum * widNum;
  const totalAreaWithWaste = netArea * (1 + wasteNum / 100);
  
  // Cartons Calculation
  const boxCoverage = product.boxCoverage || 1.44; // m2 per carton
  const cartonsNeeded = Math.ceil(totalAreaWithWaste / boxCoverage);
  const actualPurchasedMeters = cartonsNeeded * boxCoverage;

  // Cost Calculation
  const totalPrice = actualPurchasedMeters * product.price;
  const { hasDiscount } = getProductDiscount(product);
  const totalOriginalPrice = hasDiscount ? actualPurchasedMeters * Number(product.originalPrice) : 0;
  const totalSavings = hasDiscount ? totalOriginalPrice - totalPrice : 0;

  const whatsappNumber = settings?.whatsappNumber || '201000000000';
  const productLink = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;
  const calculationMessage = `السلام عليكم ورحمة الله وبركاته 💐
أود استكمال حجز مقايسة كراتين سيراميك/بورسلين عبر حاسبة المعرض الذكية:

📦 اسم الصنف: ${product.name}
🏷️ كود الصنف: ${product.code || 'غير محدد'}
📂 الفئة: ${product.category}${product.subcategory ? ` (${product.subcategory})` : ''}

📐 أبعاد المكان: ${length} × ${width} متر (مساحة صافية: ${netArea.toFixed(2)} م²)
📊 الهالك المحسوب (${wastePercent}%): ${totalAreaWithWaste.toFixed(2)} م² مع الهالك
📦 عدد الكراتين المطلوبة: ${cartonsNeeded} كرتونة (${actualPurchasedMeters.toFixed(2)} م² فعلي)
💰 إجمالي التكلفة التقديرية: ${totalPrice.toFixed(2)} ج.م${hasDiscount ? ` (🎉 ووفرت ${totalSavings.toFixed(2)} ج.م بفضل الخصم!)` : ''}

🔗 رابط الصنف المباشر بالموقع:
${productLink}

أرجو التأكيد لمعاينة عينة الصنف بالمحل وحجز الكراتين المطلوبة. 🙏✨`;

  const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(calculationMessage)}`;

  return (
    <Modal show={show} onHide={onHide} size="lg" centered className="modal-luxury">
      <Modal.Header closeButton className="modal-header-luxury">
        <Modal.Title className="d-flex align-items-center gap-2">
          <Calculator className="text-warning" size={26} />
          <span>حاسبة السيراميك والكراتين الدقيقة</span>
        </Modal.Title>
      </Modal.Header>

      <Modal.Body className="p-4">
        <div className="d-flex align-items-center gap-3 p-3 bg-light rounded-4 border mb-4">
          <img 
            src={product.image} 
            alt={product.name} 
            style={{ width: '70px', height: '70px', objectFit: 'cover', borderRadius: '12px' }} 
          />
          <div>
            <h6 className="fw-bold text-dark mb-1">{product.name}</h6>
            <div className="small text-muted">
              كود: <Badge bg="secondary">{product.code}</Badge> | السعر: <strong className="text-success">{product.price} ج.م/م²</strong>
            </div>
            <div className="small text-muted mt-1">تغطية الكرتونة الواحدة: <strong>{boxCoverage} م²</strong></div>
          </div>
        </div>

        <Row className="g-3 mb-4">
          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold">طول الغرفة / الحائط (متر):</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                min="0.5"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                className="custom-input fs-5 fw-bold text-center"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold">عرض الغرفة / الارتفاع (متر):</Form.Label>
              <Form.Control
                type="number"
                step="0.1"
                min="0.5"
                value={width}
                onChange={(e) => setWidth(e.target.value)}
                className="custom-input fs-5 fw-bold text-center"
              />
            </Form.Group>
          </Col>

          <Col md={4}>
            <Form.Group>
              <Form.Label className="fw-bold">نسبة الهالك والقص (Waste %):</Form.Label>
              <Form.Select
                value={wastePercent}
                onChange={(e) => setWastePercent(e.target.value)}
                className="custom-input fs-6"
              >
                <option value="5">5% (تركيب عادي مستقيم)</option>
                <option value="10">10% (تركيب سبعة في ثمانية / سمبكسة)</option>
                <option value="15">15% (تركيب مائل وديكورات معقدة)</option>
              </Form.Select>
            </Form.Group>
          </Col>
        </Row>

        {/* Results Card */}
        <Card className="border-warning border-2 rounded-4 bg-dark text-white p-4">
          <Row className="g-3 text-center align-items-center">
            <Col sm={6} md={3}>
              <div className="text-muted small">المساحة الصافية</div>
              <div className="fs-3 fw-bold text-light">{netArea.toFixed(2)} <span className="fs-6">م²</span></div>
            </Col>

            <Col sm={6} md={3}>
              <div className="text-muted small">المساحة مع الهالك</div>
              <div className="fs-3 fw-bold text-warning">{totalAreaWithWaste.toFixed(2)} <span className="fs-6">م²</span></div>
            </Col>

            <Col sm={6} md={3}>
              <div className="text-muted small">عدد الكراتين المطلوبة</div>
              <div className="fs-2 fw-black text-warning">
                <Box size={20} className="me-1 mb-1" />
                {cartonsNeeded}
              </div>
              <div className="small text-warning">({actualPurchasedMeters.toFixed(2)} م² فعلية)</div>
            </Col>

            <Col sm={6} md={3}>
              <div className="text-muted small">التكلفة التقديرية الإجمالية</div>
              <div className="fs-3 fw-bold text-success">{totalPrice.toFixed(2)} <span className="fs-6">ج.م</span></div>
              {hasDiscount && (
                <div className="badge bg-success bg-opacity-25 text-warning border border-warning border-opacity-50 mt-1 px-2 py-1" style={{ fontSize: '0.7rem' }}>
                  🎉 وفرت {totalSavings.toFixed(0)} ج.م!
                </div>
              )}
            </Col>
          </Row>
        </Card>
      </Modal.Body>

      <Modal.Footer className="bg-light p-3">
        <a 
          href={whatsappUrl} 
          target="_blank" 
          rel="noopener noreferrer"
          className="btn-whatsapp py-2 px-4 fs-6"
        >
          <MessageCircle size={20} />
          إرسال نتيجة الحساب للمبيعات عبر الواتساب وتأكيد التوفر
        </a>
        <Button variant="outline-secondary" onClick={onHide}>إغلاق</Button>
      </Modal.Footer>
    </Modal>
  );
};

export default TileCalculatorModal;
