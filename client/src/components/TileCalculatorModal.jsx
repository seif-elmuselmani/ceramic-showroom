import React, { useState } from 'react';
import { Modal, Form, Row, Col, Button, Card, Badge } from 'react-bootstrap';
import { Calculator, MessageCircle, Sparkles, Box, Check, HelpCircle } from 'lucide-react';
import { getProductDiscount } from '../utils/discount';

const TileCalculatorModal = ({ product, show, onHide, settings }) => {
  const [length, setLength] = useState('4');
  const [width, setWidth] = useState('5');
  const [wastePercent, setWastePercent] = useState('10'); // 5% straight, 10% diagonal/pattern
  const [pieceQuantity, setPieceQuantity] = useState('1'); // Quantity for piece/set items

  if (!product) return null;

  const isPieceProduct = product.priceUnit && (
    product.priceUnit.includes('قطعة') || 
    product.priceUnit.includes('طقم') || 
    product.priceUnit.includes('وحدة') ||
    product.category?.includes('أطقم')
  );

  const { hasDiscount } = getProductDiscount(product);
  const whatsappNumber = settings?.whatsappNumber || '201000000000';
  const productLink = `${window.location.origin}${window.location.pathname}?product=${product.id || product._id}`;

  // Area & Carton Calculations (For Tiles)
  const lenNum = parseFloat(length) || 0;
  const widNum = parseFloat(width) || 0;
  const wasteNum = parseFloat(wastePercent) || 0;
  const netArea = lenNum * widNum;
  const totalAreaWithWaste = netArea * (1 + wasteNum / 100);
  const boxCoverage = product.boxCoverage || 1.44; // m2 per carton
  const cartonsNeeded = Math.ceil(totalAreaWithWaste / boxCoverage);
  const actualPurchasedMeters = cartonsNeeded * boxCoverage;
  const totalPrice = actualPurchasedMeters * product.price;
  const totalOriginalPrice = hasDiscount ? actualPurchasedMeters * Number(product.originalPrice) : 0;
  const totalSavings = hasDiscount ? totalOriginalPrice - totalPrice : 0;

  // Quantity Calculations (For Piece / Sanitary Items)
  const pQtyNum = Math.max(1, parseInt(pieceQuantity) || 1);
  const totalPiecePrice = pQtyNum * product.price;
  const totalPieceOriginalPrice = hasDiscount ? pQtyNum * Number(product.originalPrice) : 0;
  const totalPieceSavings = hasDiscount ? totalPieceOriginalPrice - totalPiecePrice : 0;

  const calculationMessage = isPieceProduct ? `السلام عليكم ورحمة الله وبركاته 💐
أود استكمال طلب شراء وتوريد الصنف التالي من المعرض:

📦 اسم الصنف: ${product.name}
🏷️ كود الصنف: ${product.code || 'غير محدد'}
📂 الفئة: ${product.category}${product.subcategory ? ` (${product.subcategory})` : ''}

🔢 الكمية المطلوبة: ${pQtyNum} ${product.priceUnit || 'قطعة/طقم'}
💰 إجمالي التكلفة التقديرية: ${totalPiecePrice.toFixed(2)} ج.م${hasDiscount ? ` (🎉 ووفرت ${totalPieceSavings.toFixed(2)} ج.م بفضل الخصم!)` : ''}

🔗 رابط الصنف المباشر بالموقع:
${productLink}

أرجو التأكيد لمعاينة العينة بالمحل وتحديد موعد التسليم. 🙏✨` : `السلام عليكم ورحمة الله وبركاته 💐
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
          <span>{isPieceProduct ? 'حاسبة الكميات والقطع المطلوبة' : 'حاسبة السيراميك والكراتين الدقيقة'}</span>
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
            <div className="text-muted small">
              السعر: <strong className="text-warning-dark fs-6">{product.price} ج.م</strong> / {product.priceUnit || 'م2'}
              {!isPieceProduct && (
                <span className="ms-2">• سعة الكرتونة: {boxCoverage} م²</span>
              )}
            </div>
          </div>
        </div>

        {isPieceProduct ? (
          <Form>
            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-dark d-flex align-items-center gap-2">
                <Box size={18} className="text-warning" />
                حدد عدد القطع أو الأطقم المطلوبة ({product.priceUnit || 'قطعة'})
              </Form.Label>
              <Form.Control 
                type="number" 
                min="1"
                step="1"
                value={pieceQuantity}
                onChange={(e) => setPieceQuantity(e.target.value)}
                className="py-2.5 fs-5 font-bold rounded-3 border-warning"
              />
            </Form.Group>

            <Card className="border-warning bg-warning bg-opacity-10 rounded-4 p-4 shadow-sm mb-3">
              <Row className="g-3 align-items-center text-center">
                <Col md={6}>
                  <div className="text-muted small mb-1">الكمية المطلوبة</div>
                  <div className="fs-4 fw-black text-dark">{pQtyNum} {product.priceUnit || 'قطعة'}</div>
                </Col>

                <Col md={6}>
                  <div className="text-muted small mb-1">إجمالي التكلفة التقديرية</div>
                  <div className="fs-3 fw-black text-success">{totalPiecePrice.toFixed(2)} ج.م</div>
                  {hasDiscount && (
                    <div className="small fw-bold text-success mt-1">🎉 توفير بفضل الخصم: {totalPieceSavings.toFixed(2)} ج.م</div>
                  )}
                </Col>
              </Row>
            </Card>
          </Form>
        ) : (
          <Form>
            <Row className="g-3 mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold text-dark">الطول (بالمتر)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.1" 
                    value={length} 
                    onChange={(e) => setLength(e.target.value)} 
                    className="py-2 fs-5"
                  />
                </Form.Group>
              </Col>

              <Col md={6}>
                <Form.Group>
                  <Form.Label className="fw-bold text-dark">العرض (بالمتر)</Form.Label>
                  <Form.Control 
                    type="number" 
                    step="0.1" 
                    value={width} 
                    onChange={(e) => setWidth(e.target.value)} 
                    className="py-2 fs-5"
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-4">
              <Form.Label className="fw-bold text-dark d-flex align-items-center justify-content-between">
                <span>نسبة الهالك الإضافية (للتقطيع والقص):</span>
                <Badge bg="secondary">{wastePercent}% هالك</Badge>
              </Form.Label>
              <Form.Select 
                value={wastePercent} 
                onChange={(e) => setWastePercent(e.target.value)}
                className="py-2"
              >
                <option value="5">5% - رص عدل (قص عادي)</option>
                <option value="10">10% - رص سمبوكسة / ديكوري (موصى به)</option>
                <option value="15">15% - مساحات كبيرة بزوايا متعددة</option>
              </Form.Select>
            </Form.Group>

            <Card className="border-warning bg-warning bg-opacity-10 rounded-4 p-3 shadow-sm mb-3">
              <Row className="g-3 align-items-center text-center">
                <Col md={4}>
                  <div className="text-muted small mb-1">المساحة المطلوبة</div>
                  <div className="fs-5 fw-bold text-dark">{netArea.toFixed(2)} م²</div>
                  <div className="small text-muted">({totalAreaWithWaste.toFixed(2)} م² مع الهالك)</div>
                </Col>

                <Col md={4} className="border-start border-end border-warning">
                  <div className="text-muted small mb-1">الكراتين المطلوبة فلي</div>
                  <div className="fs-3 fw-black text-warning-dark">{cartonsNeeded} كرتونة</div>
                  <div className="small text-muted">({actualPurchasedMeters.toFixed(2)} م² فعلية)</div>
                </Col>

                <Col md={4}>
                  <div className="text-muted small mb-1">إجمالي التكلفة التقديرية</div>
                  <div className="fs-4 fw-black text-success">{totalPrice.toFixed(2)} ج.م</div>
                  {hasDiscount && (
                    <div className="small fw-bold text-success mt-1">🎉 ووفرت {totalSavings.toFixed(2)} ج.م</div>
                  )}
                </Col>
              </Row>
            </Card>
          </Form>
        )}
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
