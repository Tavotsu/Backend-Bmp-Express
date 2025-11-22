const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product; // Necesario para incluir detalles del producto al consultar

// 1. Crear una nueva orden (Checkout)
exports.createOrder = async (req, res) => {
  // Iniciamos una transacción para asegurar integridad de datos
  const transaction = await db.sequelize.transaction(); 
  
  try {
    const { userId, items, total } = req.body;

    // Validaciones básicas
    if (!userId) {
        return res.status(400).json({ message: 'El usuario es obligatorio.' });
    }
    if (!items || items.length === 0) {
        return res.status(400).json({ message: 'El carrito no puede estar vacío.' });
    }

    // 1. Crear la Orden Cabecera
    const newOrder = await Order.create({
      userId,
      total,
      status: 'pagado'
    }, { transaction });

    // 2. Preparar los datos de los items
    const orderItemsData = items.map(item => ({
      orderId: newOrder.id,
      productId: item.id, // El ID viene del producto en el carrito
      quantity: item.quantity,
      price: item.price
    }));

    // 3. Guardar todos los items en la tabla OrderItems
    await OrderItem.bulkCreate(orderItemsData, { transaction });

    // 4. Si todo sale bien, confirmamos la transacción en la BD
    await transaction.commit();

    console.log(`Orden #${newOrder.id} creada exitosamente para el usuario ${userId}`);
    
    res.status(201).json({ 
        message: 'Compra realizada con éxito', 
        orderId: newOrder.id,
        order: newOrder 
    });

  } catch (error) {
    // Si algo falla, deshacemos cualquier cambio en la BD
    await transaction.rollback();
    console.error('Error al crear la orden:', error);
    res.status(500).json({ message: 'Error al procesar la compra', error: error.message });
  }
};

// 2. Obtener historial de órdenes de un usuario
exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;

    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [
            {
              model: Product,
              as: 'product',
              attributes: ['name', 'image'] // Solo traemos nombre e imagen del producto
            }
          ]
        }
      ],
      order: [['createdAt', 'DESC']] // Las más recientes primero
    });

    res.status(200).json(orders);
  } catch (error) {
    console.error('Error al obtener historial:', error);
    res.status(500).json({ message: 'Error al obtener historial de compras', error: error.message });
  }
};