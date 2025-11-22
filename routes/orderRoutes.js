const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// POST /api/orders -> Crear una orden
router.post('/', orderController.createOrder);

// GET /api/orders/user/:userId -> Ver historial de un usuario
router.get('/user/:userId', orderController.getUserOrders);

module.exports = router;