// backend/routes/reservasiRoutes.js
const express = require('express');
const router = express.Router();
const reservasiController = require('../controllers/reservasiController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.post('/check-availability', verifyToken, reservasiController.checkAvailability);
router.post('/submit', verifyToken, reservasiController.submit);
router.get('/', verifyToken, reservasiController.getAll);
router.put('/:id/status', verifyAdmin, reservasiController.approveReject);

module.exports = router;
