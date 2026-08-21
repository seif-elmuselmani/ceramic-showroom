const fs = require('fs');

const fixComponent = (filePath) => {
  let content = fs.readFileSync(filePath, 'utf8');
  content = content.replace(/return \(\n/g, 'return (\n<>\n');
  content = content.replace(/\n  \);\n};\nexport/g, '\n</>\n  );\n};\nexport');
  fs.writeFileSync(filePath, content);
};

fixComponent('client/src/components/home/HeroSection.jsx');
fixComponent('client/src/components/home/FilterSidebar.jsx');
fixComponent('client/src/components/home/ProductGrid.jsx');
console.log("Fixed React Fragments!");
