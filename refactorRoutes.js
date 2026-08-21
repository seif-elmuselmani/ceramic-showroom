const fs = require('fs');
const path = require('path');

const controllersDir = path.join(__dirname, 'server', 'controllers');
if (!fs.existsSync(controllersDir)) {
  fs.mkdirSync(controllersDir);
}

const originalRoutesPath = path.join(__dirname, 'server', 'routes', 'ownerRoutes.js');
const controllerPath = path.join(controllersDir, 'ownerController.js');

let content = fs.readFileSync(originalRoutesPath, 'utf8');

// 1. Create ownerController.js
let controllerContent = content;
// Remove router and express from controller
controllerContent = controllerContent.replace("const express = require('express');\nconst router = express.Router();\n", "");
controllerContent = controllerContent.replace("module.exports = router;", "");

// Replace router methods with exports
controllerContent = controllerContent.replace(/router\.post\(\[\'\/api\/owner\/import-products\'.*?async \(req, res\) => {/g, 'exports.importProducts = async (req, res) => {');
controllerContent = controllerContent.replace(/router\.get\(\[\'\/api\/owner\/export-csv\'.*?async \(req, res\) => {/g, 'exports.exportCsv = async (req, res) => {');
controllerContent = controllerContent.replace(/router\.get\(\[\'\/api\/owner\/export-json\'.*?async \(req, res\) => {/g, 'exports.exportJson = async (req, res) => {');
controllerContent = controllerContent.replace(/router\.get\(\[\'\/api\/owner\/seed-test-data\'.*?async \(req, res\) => {/g, 'exports.seedTestData = async (req, res) => {');
controllerContent = controllerContent.replace(/router\.get\(\[\'\/api\/owner\/export-media-archive\'.*?async \(req, res\) => {/g, 'exports.exportMediaArchive = async (req, res) => {');
controllerContent = controllerContent.replace(/router\.get\(\[\'\/api\/owner\/download-images-zip\'.*?async \(req, res\) => {/g, 'exports.downloadImagesZip = async (req, res) => {');
controllerContent = controllerContent.replace(/router\.post\(\[\'\/api\/owner\/restore-product\/:id\'.*?async \(req, res\) => {/g, 'exports.restoreProduct = async (req, res) => {');

// Remove closing brackets for router methods
controllerContent = controllerContent.replace(/\}\);\n/g, '};\n');

fs.writeFileSync(controllerPath, controllerContent);

// 2. Rewrite ownerRoutes.js
const newRoutesContent = `const express = require('express');
const router = express.Router();
const ownerController = require('../controllers/ownerController');

// Bulk Import Products (Owner Protected Endpoint)
router.post(['/api/owner/import-products', '/owner/import-products', '/api/products/import-bulk'], ownerController.importProducts);

// Secret CSV / Excel Inventory Export (Owner Only)
router.get(['/api/owner/export-csv', '/owner/export-csv', '/api/export-csv', '/export-csv'], ownerController.exportCsv);

// Secret JSON Backup Export
router.get(['/api/owner/export-json', '/owner/export-json'], ownerController.exportJson);

// Secret Seed Test Data Endpoint
router.get(['/api/owner/seed-test-data', '/owner/seed-test-data'], ownerController.seedTestData);

// Secret Media Archive Endpoint (Downloads all Local Images as ZIP)
router.get(['/api/owner/export-media-archive', '/owner/export-media-archive'], ownerController.exportMediaArchive);

// Secret Image Download Endpoint (Cloudinary + Local)
router.get(['/api/owner/download-images-zip', '/owner/download-images-zip', '/api/download-all-zip', '/download-all-zip'], ownerController.downloadImagesZip);

// Restore Soft Deleted Product
router.post(['/api/owner/restore-product/:id', '/owner/restore-product/:id', '/api/products/restore/:id'], ownerController.restoreProduct);

module.exports = router;
`;

fs.writeFileSync(originalRoutesPath, newRoutesContent);

console.log("Refactored ownerRoutes.js to ownerController.js successfully.");
