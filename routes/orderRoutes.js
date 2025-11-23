const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');


router.post('/', orderController.createOrder);                // Crear compra
router.get('/user/:userId', orderController.getUserOrders);   // Historial personal


router.get('/', orderController.getAllOrders);                // Ver todas las ventas
router.get('/:id', orderController.getOrderById);             // Ver detalle de una venta
router.put('/:id', orderController.updateOrderStatus);        // Cambiar estado (ej: Enviado)
router.delete('/:id', orderController.deleteOrder);           // Eliminar venta

module.exports = router;