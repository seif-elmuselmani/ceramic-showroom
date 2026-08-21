const fs = require('fs');
const lines = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8').split('\n');

const settingsStart = lines.findIndex(l => l.includes('<Tab eventKey="settings"'));
const categoriesStart = lines.findIndex(l => l.includes('<Tab eventKey="categories"'));

if (settingsStart > -1 && categoriesStart > -1) {
  const tabLines = lines.slice(settingsStart + 1, categoriesStart - 2); 
  const component = `import React from 'react';\nimport { Card, Form, Button } from 'react-bootstrap';\nimport { Settings } from 'lucide-react';\n\nconst AdminSettingsTab = ({ settingsForm, setSettingsForm, handleSettingsSubmit }) => {\n  return (\n${tabLines.join('\n')}\n  );\n};\n\nexport default AdminSettingsTab;\n`;
  fs.writeFileSync('client/src/components/admin/AdminSettingsTab.jsx', component);
  
  const before = lines.slice(0, settingsStart + 1);
  const after = lines.slice(categoriesStart - 2);
  const replacement = `            <AdminSettingsTab \n              settingsForm={settingsForm} \n              setSettingsForm={setSettingsForm} \n              handleSettingsSubmit={handleSettingsSubmit} \n            />`;
  const newContent = [...before, replacement, ...after];
  
  // Need to import AdminSettingsTab at the top
  const importLine = `import AdminSettingsTab from '../components/admin/AdminSettingsTab';`;
  const importIndex = newContent.findIndex(l => l.includes('import axios'));
  newContent.splice(importIndex + 1, 0, importLine);

  fs.writeFileSync('client/src/pages/AdminDashboard.jsx', newContent.join('\n'));
  console.log("Extracted Settings Tab!");
}
