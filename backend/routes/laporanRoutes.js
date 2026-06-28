// backend/routes/laporanRoutes.js
const express = require('express');
const router = express.Router();
const laporanController = require('../controllers/laporanController');
const { verifyToken } = require('../middleware/auth');

router.get('/monthly', verifyToken, laporanController.getMonthlyStats);
router.get('/building-usage', verifyToken, laporanController.getBuildingUsage);
router.get('/status-distribution', verifyToken, laporanController.getStatusDistribution);
router.get('/rekap', verifyToken, laporanController.getRekapDetail);

module.exports = router;
