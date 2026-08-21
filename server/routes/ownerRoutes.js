const express = require('express');
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
