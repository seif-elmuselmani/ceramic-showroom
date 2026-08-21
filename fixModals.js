const fs = require('fs');

const fixModal = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/return \(\n/g, 'return (\n<>\n');
  content = content.replace(/\n  \);\n};\nexport/g, '\n</>\n  );\n};\nexport');
  fs.writeFileSync(filePath, content);
};

fixModal('client/src/components/admin/modals/AdminProductModal.jsx');
fixModal('client/src/components/admin/modals/AdminPriceModal.jsx');
fixModal('client/src/components/admin/modals/AdminCategoryModal.jsx');
console.log("Fixed Modals Fragments!");
