const fs = require('fs');

const lines = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8').split('\n');

const productModalStart = lines.findIndex(l => l.includes('<Modal show={showProductModal}'));
const priceModalStart = lines.findIndex(l => l.includes('<Modal show={showPriceModal}'));
const categoryModalStart = lines.findIndex(l => l.includes('<Modal show={showCategoryModal}'));

const productModalEnd = priceModalStart - 1; // Assuming price modal is right after
const priceModalEnd = categoryModalStart - 1;
const categoryModalEnd = lines.findLastIndex(l => l.includes('</Modal>'));

if (productModalStart > -1 && priceModalStart > -1 && categoryModalStart > -1) {
  // 1. AdminProductModal
  const productModalLines = lines.slice(productModalStart, productModalEnd + 1);
  const pmComponent = `import React from 'react';\nimport { Modal, Form, Row, Col, InputGroup, Button, Badge, Spinner } from 'react-bootstrap';\nimport { Save, PlusCircle, CheckCircle2, ShieldCheck, Award, XCircle, Trash2 } from 'lucide-react';\n\nconst AdminProductModal = ({ showProductModal, setShowProductModal, editingProduct, formData, setFormData, handleProductSubmit, categories }) => {\n  return (\n${productModalLines.join('\n')}\n  );\n};\nexport default AdminProductModal;`;
  fs.writeFileSync('client/src/components/admin/modals/AdminProductModal.jsx', pmComponent);

  // 2. AdminPriceModal
  const priceModalLines = lines.slice(priceModalStart, priceModalEnd + 1);
  const prComponent = `import React from 'react';\nimport { Modal, Form, Button } from 'react-bootstrap';\nimport { DollarSign } from 'lucide-react';\n\nconst AdminPriceModal = ({ showPriceModal, setShowPriceModal, priceProduct, newOriginalPrice, setNewOriginalPrice, handleSavePrice }) => {\n  return (\n${priceModalLines.join('\n')}\n  );\n};\nexport default AdminPriceModal;`;
  fs.writeFileSync('client/src/components/admin/modals/AdminPriceModal.jsx', prComponent);

  // 3. AdminCategoryModal
  const categoryModalLines = lines.slice(categoryModalStart, categoryModalEnd + 1);
  const cmComponent = `import React from 'react';\nimport { Modal, Form, InputGroup, Button, Badge } from 'react-bootstrap';\nimport { Layers, PlusCircle, Save, Trash2 } from 'lucide-react';\n\nconst AdminCategoryModal = ({ showCategoryModal, setShowCategoryModal, editingCategory, categoryFormData, setCategoryFormData, newSubcategory, setNewSubcategory, handleAddSubcategory, handleRemoveSubcategory, handleCategorySubmit }) => {\n  return (\n${categoryModalLines.join('\n')}\n  );\n};\nexport default AdminCategoryModal;`;
  fs.writeFileSync('client/src/components/admin/modals/AdminCategoryModal.jsx', cmComponent);

  // Replace in AdminDashboard
  const before = lines.slice(0, productModalStart);
  const after = lines.slice(categoryModalEnd + 1);
  
  const replacements = `      <AdminProductModal
        showProductModal={showProductModal}
        setShowProductModal={setShowProductModal}
        editingProduct={editingProduct}
        formData={formData}
        setFormData={setFormData}
        handleProductSubmit={handleProductSubmit}
        categories={categories}
      />
      <AdminPriceModal
        showPriceModal={showPriceModal}
        setShowPriceModal={setShowPriceModal}
        priceProduct={priceProduct}
        newOriginalPrice={newOriginalPrice}
        setNewOriginalPrice={setNewOriginalPrice}
        handleSavePrice={handleSavePrice}
      />
      <AdminCategoryModal
        showCategoryModal={showCategoryModal}
        setShowCategoryModal={setShowCategoryModal}
        editingCategory={editingCategory}
        categoryFormData={categoryFormData}
        setCategoryFormData={setCategoryFormData}
        newSubcategory={newSubcategory}
        setNewSubcategory={setNewSubcategory}
        handleAddSubcategory={handleAddSubcategory}
        handleRemoveSubcategory={handleRemoveSubcategory}
        handleCategorySubmit={handleCategorySubmit}
      />`;

  const newContent = [...before, replacements, ...after];
  
  const imports = `import AdminProductModal from '../components/admin/modals/AdminProductModal';\nimport AdminPriceModal from '../components/admin/modals/AdminPriceModal';\nimport AdminCategoryModal from '../components/admin/modals/AdminCategoryModal';`;
  const importIndex = newContent.findIndex(l => l.includes('import AdminProductsTab'));
  newContent.splice(importIndex + 1, 0, imports);

  fs.writeFileSync('client/src/pages/AdminDashboard.jsx', newContent.join('\n'));
  console.log("Modals extracted successfully!");
} else {
  console.log("Could not find all modals.");
}
