const fs = require('fs');
const lines = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8').split('\n');

const categoriesStart = lines.findIndex(l => l.includes('<Tab eventKey="categories"'));
const tabsEnd = lines.findIndex(l => l.includes('</Tabs>'));

if (categoriesStart > -1 && tabsEnd > -1) {
  const tabLines = lines.slice(categoriesStart + 1, tabsEnd - 1); 
  const component = `import React from 'react';\nimport { Card, Button, Table, Badge } from 'react-bootstrap';\nimport { Layers, PlusCircle, Edit, Trash2 } from 'lucide-react';\n\nconst AdminCategoriesTab = ({ categories, handleOpenCategoryModal, handleDeleteCategory }) => {\n  return (\n${tabLines.join('\n')}\n  );\n};\n\nexport default AdminCategoriesTab;\n`;
  fs.writeFileSync('client/src/components/admin/AdminCategoriesTab.jsx', component);
  
  const before = lines.slice(0, categoriesStart + 1);
  const after = lines.slice(tabsEnd - 1);
  const replacement = `            <AdminCategoriesTab \n              categories={categories} \n              handleOpenCategoryModal={handleOpenCategoryModal} \n              handleDeleteCategory={handleDeleteCategory} \n            />`;
  const newContent = [...before, replacement, ...after];
  
  const importLine = `import AdminCategoriesTab from '../components/admin/AdminCategoriesTab';`;
  const importIndex = newContent.findIndex(l => l.includes('import AdminSettingsTab'));
  newContent.splice(importIndex + 1, 0, importLine);

  fs.writeFileSync('client/src/pages/AdminDashboard.jsx', newContent.join('\n'));
  console.log("Extracted Categories Tab!");
}
