const fs = require('fs');

const originalRoutesPath = 'server/routes/ownerRoutes.js';
const controllerPath = 'server/controllers/ownerController.js';

let content = fs.readFileSync(originalRoutesPath, 'utf8');

let ctrl = content.replace("const express = require('express');\nconst router = express.Router();\n", "");
ctrl = ctrl.replace("module.exports = router;", "");

ctrl = ctrl.replace(/router\.post\(\[\'\/api\/owner\/import-products\'.*?async \(req, res\) => {/g, 'exports.importProducts = async (req, res) => {');
ctrl = ctrl.replace(/router\.get\(\[\'\/api\/owner\/export-csv\'.*?async \(req, res\) => {/g, 'exports.exportCsv = async (req, res) => {');
ctrl = ctrl.replace(/router\.get\(\[\'\/api\/owner\/export-json\'.*?async \(req, res\) => {/g, 'exports.exportJson = async (req, res) => {');
ctrl = ctrl.replace(/router\.get\(\[\'\/api\/owner\/seed-test-data\'.*?async \(req, res\) => {/g, 'exports.seedTestData = async (req, res) => {');
ctrl = ctrl.replace(/router\.get\(\[\'\/api\/owner\/export-media-archive\'.*?async \(req, res\) => {/g, 'exports.exportMediaArchive = async (req, res) => {');
ctrl = ctrl.replace(/router\.get\(\[\'\/api\/owner\/download-images-zip\'.*?async \(req, res\) => {/g, 'exports.downloadImagesZip = async (req, res) => {');
ctrl = ctrl.replace(/router\.post\(\[\'\/api\/owner\/restore-product\/:id\'.*?async \(req, res\) => {/g, 'exports.restoreProduct = async (req, res) => {');

// Safely replace the closing }); of routes
ctrl = ctrl.replace(/^}\);$/gm, '};');

fs.writeFileSync(controllerPath, ctrl);

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
console.log("Refactored safely.");
