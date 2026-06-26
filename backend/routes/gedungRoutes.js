// backend/routes/gedungRoutes.js
const express = require('express');
const router = express.Router();
const gedungController = require('../controllers/gedungController');
const { verifyToken, verifyAdmin } = require('../middleware/auth');

router.get('/', verifyToken, gedungController.getAll);
router.get('/:id', verifyToken, gedungController.getById);
router.post('/', verifyAdmin, gedungController.create);
router.put('/:id', verifyAdmin, gedungController.update);
router.delete('/:id', verifyAdmin, gedungController.delete);

module.exports = router;
