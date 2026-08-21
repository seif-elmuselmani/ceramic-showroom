const fs = require('fs');
const lines = fs.readFileSync('client/src/pages/AdminDashboard.jsx', 'utf8').split('\n');

const productsStart = lines.findIndex(l => l.includes('<Tab eventKey="products"'));
const settingsStart = lines.findIndex(l => l.includes('<Tab eventKey="settings"'));

if (productsStart > -1 && settingsStart > -1) {
  const tabLines = lines.slice(productsStart + 1, settingsStart - 2); 
  const component = `import React from 'react';
import { Card, Row, Col, InputGroup, Form, Button, Spinner, Badge, Table } from 'react-bootstrap';
import { Search, RefreshCw, DollarSign, Edit, Trash2 } from 'lucide-react';

const AdminProductsTab = ({
  searchTerm, setSearchTerm, filterCategory, setFilterCategory,
  categories, fetchDashboardData, loading, filteredProducts,
  handleToggleStock, handleOpenPriceModal, handleOpenProductModal, handleDelete
}) => {
  return (
${tabLines.join('\n')}
  );
};

export default AdminProductsTab;
`;
  fs.writeFileSync('client/src/components/admin/AdminProductsTab.jsx', component);
  
  const before = lines.slice(0, productsStart + 1);
  const after = lines.slice(settingsStart - 2);
  const replacement = `            <AdminProductsTab 
              searchTerm={searchTerm} 
              setSearchTerm={setSearchTerm} 
              filterCategory={filterCategory} 
              setFilterCategory={setFilterCategory} 
              categories={categories} 
              fetchDashboardData={fetchDashboardData} 
              loading={loading} 
              filteredProducts={filteredProducts} 
              handleToggleStock={handleToggleStock} 
              handleOpenPriceModal={handleOpenPriceModal} 
              handleOpenProductModal={handleOpenProductModal} 
              handleDelete={handleDelete} 
            />`;
  const newContent = [...before, replacement, ...after];
  
  const importLine = `import AdminProductsTab from '../components/admin/AdminProductsTab';`;
  const importIndex = newContent.findIndex(l => l.includes('import AdminCategoriesTab'));
  newContent.splice(importIndex + 1, 0, importLine);

  fs.writeFileSync('client/src/pages/AdminDashboard.jsx', newContent.join('\n'));
  console.log("Extracted Products Tab!");
}
