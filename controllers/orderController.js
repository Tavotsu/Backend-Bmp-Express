const db = require('../models');
const Order = db.Order;
const OrderItem = db.OrderItem;
const Product = db.Product;
const User = db.User;


exports.createOrder = async (req, res) => {
  const transaction = await db.sequelize.transaction();
  try {
    const { userId, items, total } = req.body;

    if (!userId || !items || items.length === 0) {
      return res.status(400).json({ message: 'Datos incompletos para la orden' });
    }

    const newOrder = await Order.create({
      userId,
      total,
      status: 'Pagado'
    }, { transaction });

    const orderItemsData = items.map(item => ({
      orderId: newOrder.id,
      productId: item.id,
      quantity: item.quantity,
      price: item.price
    }));

    await OrderItem.bulkCreate(orderItemsData, { transaction });
    await transaction.commit();

    res.status(201).json({ message: 'Orden creada con éxito', orderId: newOrder.id });
  } catch (error) {
    await transaction.rollback();
    res.status(500).json({ message: 'Error al crear la orden', error: error.message });
  }
};


exports.getUserOrders = async (req, res) => {
  try {
    const { userId } = req.params;
    const orders = await Order.findAll({
      where: { userId },
      include: [
        {
          model: OrderItem,
          as: 'items',
          include: [{ model: Product, as: 'product', attributes: ['name', 'image'] }]
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener historial', error: error.message });
  }
};




exports.getAllOrders = async (req, res) => {
  try {
    const orders = await Order.findAll({
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] }, 
        { model: OrderItem, as: 'items' }
      ],
      order: [['createdAt', 'DESC']]
    });
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener todas las órdenes', error: error.message });
  }
};


exports.getOrderById = async (req, res) => {
  try {
    const { id } = req.params;
    const order = await Order.findByPk(id, {
      include: [
        { model: User, as: 'user', attributes: ['name', 'email'] },
        { 
          model: OrderItem, 
          as: 'items',
          include: [{ model: Product, as: 'product' }]
        }
      ]
    });

    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });
    
    res.json(order);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener la orden', error: error.message });
  }
};


exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { status } = req.body; 

    const order = await Order.findByPk(id);
    if (!order) return res.status(404).json({ message: 'Orden no encontrada' });

    await order.update({ status });
    res.json({ message: 'Estado actualizado', order });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar estado', error: error.message });
  }
};


exports.deleteOrder = async (req, res) => {
  try {
    const { id } = req.params;
    const deleted = await Order.destroy({ where: { id } });
    
    if (!deleted) return res.status(404).json({ message: 'Orden no encontrada' });

    res.json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar orden', error: error.message });
  }
};