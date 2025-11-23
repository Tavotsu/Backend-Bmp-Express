const db = require('../models');
const User = db.User;
const Product = db.Product;
const Order = db.Order;


exports.getStats = async (req, res) => {
    try {
       
        const [userCount, productCount, orderCount, totalSales] = await Promise.all([
            User.count(),
            Product.count(),
            Order.count(),
            Order.sum('total') 
        ]);

        res.json({
            users: userCount,
            products: productCount,
            orders: orderCount,
            totalSales: totalSales || 0
        });
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener estadísticas', error: error.message });
    }
};