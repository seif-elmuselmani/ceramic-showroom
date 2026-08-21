const fs = require('fs');

let content = fs.readFileSync('client/src/components/ProductModal.jsx', 'utf8');

const newVariantsUX = `              {hasVariants && (
                <div className="p-3 mb-3 bg-light rounded-4 border border-slate-200 shadow-sm">
                  {/* Row 1: Color Selection with Visual Swatches */}
                  {availableColors.length > 0 && (
                    <div className="mb-3">
                      <div className="fs-7 fw-bold text-dark mb-2 d-flex align-items-center justify-content-between">
                        <span className="d-flex align-items-center gap-1.5">
                          🎨 اللون المختار: <strong className="text-primary">{selectedColor}</strong>
                        </span>
                        <span className="badge bg-white text-muted border rounded-pill px-2.5 py-1 fs-8">
                          {availableColors.length} ألوان متوفرة
                        </span>
                      </div>

                      <div className="d-flex flex-wrap gap-2">
                        {availableColors.map((colorName) => {
                          const isSelected = selectedColor === colorName;
                          const variantForColor = product.variants.find(v => (v.color || '').trim() === colorName);
                          const swatchImage = variantForColor?.image;
                          
                          const colorHex = 
                            colorName.includes('أبيض') ? '#ffffff' :
                            colorName.includes('برجامون') || colorName.includes('بيج') ? '#f5e6d3' :
                            colorName.includes('أسود') ? '#1e293b' :
                            colorName.includes('ذهب') ? '#d4af37' :
                            colorName.includes('فض') || colorName.includes('كروم') ? '#cbd5e1' :
                            colorName.includes('رمادي') ? '#64748b' :
                            colorName.includes('خشب') || colorName.includes('بني') ? '#8b5a2b' : '#334155';

                          return (
                            <button
                              key={colorName}
                              type="button"
                              onClick={() => handleColorClick(colorName)}
                              className={\`btn rounded-3 px-3 py-2 fs-7 fw-bold transition-all d-flex align-items-center gap-2 \${
                                isSelected 
                                  ? 'bg-dark text-warning border-dark shadow-sm' 
                                  : 'bg-white text-dark border-slate-300 hover-bg-light'
                              }\`}
                            >
                              <span 
                                className="rounded-circle border d-inline-block flex-shrink-0"
                                style={{
                                  width: swatchImage ? '24px' : '16px',
                                  height: swatchImage ? '24px' : '16px',
                                  backgroundColor: swatchImage ? 'transparent' : colorHex,
                                  backgroundImage: swatchImage ? \`url(\${swatchImage})\` : 'none',
                                  backgroundSize: 'cover',
                                  backgroundPosition: 'center',
                                  border: isSelected ? '1px solid #d4af37' : '1px solid #94a3b8'
                                }}
                              />
                              {colorName}
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Row 2: Cover Type Selection */}
                  {availableCoverTypes.length > 0 && (
                    <div>
                      <div className="fs-7 fw-bold text-dark mb-2 d-flex align-items-center justify-content-between">
                        <span className="d-flex align-items-center gap-1.5">
                          🚽 نوع الغطاء / المواصفة: <strong className="text-primary">{selectedCoverType}</strong>
                        </span>
                      </div>
                      <div className="d-flex flex-wrap gap-2">
                        {availableCoverTypes.map((coverName) => {
                          const isSelected = selectedCoverType === coverName;
                          const v = product.variants.find(v => (v.coverType || '').trim() === coverName && (v.color || '').trim() === selectedColor);
                          const currentBasePrice = Number(product.price) || 0;
                          const variantPrice = v && v.price ? Number(v.price) : currentBasePrice;
                          const diff = variantPrice - currentBasePrice;
                          
                          let priceBadge = '';
                          if (diff > 0) priceBadge = \` (+\${diff.toLocaleString()} ج)\`;
                          else if (diff < 0) priceBadge = \` (-\${Math.abs(diff).toLocaleString()} ج)\`;

                          return (
                            <button
                              key={coverName}
                              type="button"
                              onClick={() => handleCoverClick(coverName)}
                              className={\`btn rounded-3 px-3 py-2 fs-7 transition-all d-flex align-items-center gap-2 \${
                                isSelected 
                                  ? 'bg-primary text-white border-primary shadow-sm fw-bold' 
                                  : 'bg-white text-secondary border-slate-300 hover-bg-light'
                              }\`}
                            >
                              {isSelected ? <CheckCircle2 size={16} /> : <div style={{width:'16px'}}/>}
                              <span>{coverName} <small className={diff > 0 ? 'text-warning' : ''}>{priceBadge}</small></span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}
                </div>
              )}`;

const startIndex = content.indexOf('{hasVariants && (');
const endIndex = content.indexOf('                {/* Mobile: Order Button Under Price */}');

if (startIndex !== -1 && endIndex !== -1) {
  content = content.substring(0, startIndex) + newVariantsUX + '\n\n' + content.substring(endIndex);
  fs.writeFileSync('client/src/components/ProductModal.jsx', content);
  console.log("Variant Client UX replaced successfully!");
} else {
  console.log("Could not find blocks in ProductModal!");
}
