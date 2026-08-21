const fs = require('fs');

const lines = fs.readFileSync('client/src/pages/Home.jsx', 'utf8').split('\n');

const heroStart = lines.findIndex(l => l.includes('{/* Hero Banner Section'));
const filterStart = lines.findIndex(l => l.includes('{/* Filter and Search Container'));
const gridStart = lines.findIndex(l => l.includes('{/* Main Catalog Grid Section'));
const modalStart = lines.findIndex(l => l.includes('{/* Product Detail Modal'));

if (heroStart > -1 && filterStart > -1 && gridStart > -1 && modalStart > -1) {
  // 1. HeroSection
  const heroLines = lines.slice(heroStart, filterStart);
  // Remove wrapping Container/Row if they are at the top of HeroSection
  const heroComponent = `import React from 'react';\nimport { Container, Row, Col, Badge } from 'react-bootstrap';\nimport { Sparkles, ShieldCheck, Award } from 'lucide-react';\n\nconst HeroSection = ({ settings, mode }) => {\n  return (\n${heroLines.join('\n')}\n  );\n};\nexport default HeroSection;`;
  fs.writeFileSync('client/src/components/home/HeroSection.jsx', heroComponent);

  // 2. FilterSidebar
  const filterLines = lines.slice(filterStart, gridStart);
  const filterComponent = `import React from 'react';\nimport { Card, InputGroup, Form, Button, Badge, Row, Col } from 'react-bootstrap';\nimport { Search, Filter, Layers, SlidersHorizontal, XCircle } from 'lucide-react';\n\nconst FilterSidebar = ({\n  searchTerm, setSearchTerm, selectedBrand, setSelectedBrand, availableBrands,\n  selectedFinish, setSelectedFinish, availableFinishes, selectedGrade, setSelectedGrade, availableGrades,\n  sortBy, setSortBy, inStockOnly, setInStockOnly, onSaleOnly, setOnSaleOnly,\n  categories, selectedCategory, setSelectedCategory, selectedSubcategory, setSelectedSubcategory\n}) => {\n  return (\n${filterLines.join('\n')}\n  );\n};\nexport default FilterSidebar;`;
  fs.writeFileSync('client/src/components/home/FilterSidebar.jsx', filterComponent);

  // 3. ProductGrid
  const gridLines = lines.slice(gridStart, modalStart);
  const gridComponent = `import React from 'react';\nimport { Row, Col, Alert, Badge, Button, Form } from 'react-bootstrap';\nimport ProductCard from '../ProductCard';\n\nconst ProductGrid = ({\n  paginatedProducts, selectedBrand, itemsPerPage, setItemsPerPage,\n  currentPage, setCurrentPage, totalPages, handleOpenModal, handleOpenCalculator\n}) => {\n  return (\n${gridLines.join('\n')}\n  );\n};\nexport default ProductGrid;`;
  fs.writeFileSync('client/src/components/home/ProductGrid.jsx', gridComponent);

  // Replace in Home.jsx
  const before = lines.slice(0, heroStart);
  const after = lines.slice(modalStart);
  
  const replacements = `      <HeroSection settings={settings} mode={mode} />
      <FilterSidebar 
        searchTerm={searchTerm} setSearchTerm={setSearchTerm}
        selectedBrand={selectedBrand} setSelectedBrand={setSelectedBrand} availableBrands={availableBrands}
        selectedFinish={selectedFinish} setSelectedFinish={setSelectedFinish} availableFinishes={availableFinishes}
        selectedGrade={selectedGrade} setSelectedGrade={setSelectedGrade} availableGrades={availableGrades}
        sortBy={sortBy} setSortBy={setSortBy} 
        inStockOnly={inStockOnly} setInStockOnly={setInStockOnly}
        onSaleOnly={onSaleOnly} setOnSaleOnly={setOnSaleOnly}
        categories={categories} selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory}
        selectedSubcategory={selectedSubcategory} setSelectedSubcategory={setSelectedSubcategory}
      />
      <ProductGrid 
        paginatedProducts={paginatedProducts} 
        selectedBrand={selectedBrand} 
        itemsPerPage={itemsPerPage} setItemsPerPage={setItemsPerPage}
        currentPage={currentPage} setCurrentPage={setCurrentPage} totalPages={totalPages}
        handleOpenModal={handleOpenModal} handleOpenCalculator={handleOpenCalculator}
      />`;

  const newContent = [...before, replacements, ...after];
  
  const imports = `import HeroSection from '../components/home/HeroSection';\nimport FilterSidebar from '../components/home/FilterSidebar';\nimport ProductGrid from '../components/home/ProductGrid';`;
  const importIndex = newContent.findIndex(l => l.includes('import ProductCard'));
  newContent.splice(importIndex, 0, imports);

  fs.writeFileSync('client/src/pages/Home.jsx', newContent.join('\n'));
  console.log("Home extracted successfully!");
} else {
  console.log("Could not find all home sections.");
}
