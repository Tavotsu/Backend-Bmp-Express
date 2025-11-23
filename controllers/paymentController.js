const { WebpayPlus } = require('transbank-sdk');
const { Options, IntegrationApiKeys, Environment, IntegrationCommerceCodes } = require('transbank-sdk');
const { Order, OrderItem } = require('../models');

// Configuración explícita de Integración (Pruebas)
const tx = new WebpayPlus.Transaction(
  new Options(
    IntegrationCommerceCodes.WEBPAY_PLUS,
    IntegrationApiKeys.WEBPAY,
    Environment.Integration
  )
);

exports.initTransaction = async (req, res) => {
  try {
    // 1. Limpieza de datos (Crucial para que Transbank no falle)
    const { userId, items, total } = req.body;
    
    // Aseguramos que el total sea un número entero positivo
    const amount = Math.round(Number(total)); 
    
    if (!amount || amount <= 0) {
      return res.status(400).json({ message: 'El monto total debe ser mayor a 0' });
    }

    const buyOrder = "O-" + Math.floor(Math.random() * 10000) + "-" + Date.now();
    const sessionId = "S-" + Date.now();
    const returnUrl = 'http://localhost:3000/pago-finalizado';

    console.log(" Iniciando transacción...", { buyOrder, amount, returnUrl });

    // 2. Crear la Orden en Base de Datos
    const newOrder = await Order.create({
      userId,
      total: amount,
      status: 'Pendiente'
    });

    // Guardar items
    const orderItemsData = items.map(item => ({
      orderId: newOrder.id,
      productId: item.id,
      quantity: item.quantity,
      price: item.price
    }));
    await OrderItem.bulkCreate(orderItemsData);

    // 3. Solicitar pago a Transbank
    const createResponse = await tx.create(
      buyOrder, 
      sessionId, 
      amount, 
      returnUrl
    );

    // LOG DE DEPURACIÓN: Mira esto en tu consola negra del backend
    console.log(" Respuesta de Transbank:", createResponse);

    // 4. Responder al Frontend
    res.json({
      token: createResponse.token,
      url: createResponse.url,
      orderId: newOrder.id
    });

  } catch (error) {
    console.error(" Error Fatal en Webpay Init:", error);
    res.status(500).json({ 
      message: 'Error al iniciar pago con Transbank', 
      error: error.message 
    });
  }
};

exports.commitTransaction = async (req, res) => {
  try {
    const { token_ws } = req.body;
    
    console.log(" Confirmando transacción con token:", token_ws);

    // Confirmar con Transbank
    const commitResponse = await tx.commit(token_ws);

    console.log(" Estado de Transacción:", commitResponse.status);

    if (commitResponse.response_code === 0) {
      res.json({
        status: 'AUTHORIZED',
        detail: commitResponse
      });
    } else {
      res.json({
        status: 'REJECTED',
        detail: commitResponse
      });
    }

  } catch (error) {
    console.error(" Error en Webpay Commit:", error);
    res.status(500).json({ message: 'Error al confirmar pago', error: error.message });
  }
};