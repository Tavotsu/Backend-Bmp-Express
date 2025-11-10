const db = require('../models');
const Product = db.Product;
const { defaultProducts } = require('../data/defaultProducts'); // <-- Importante

// Obtener todos los productos
exports.getAllProducts = async (req, res) => {
  try {
    let products = await Product.findAll();
    
    // Si no hay productos en la BBDD, los insertamos por primera vez
    if (products.length === 0) {
      console.log('Base de datos vacía, insertando productos por defecto...');
      products = await Product.bulkCreate(defaultProducts);
    }
    res.status(200).json(products);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener productos', error: error.message });
  }
};

// Crear un producto (Admin)
exports.createProduct = async (req, res) => {
  try {
    const { name, price, image, category } = req.body;
    if (!name || !price || !image) {
      return res.status(400).json({ message: 'Faltan campos obligatorios' });
    }
    
    const newProduct = await Product.create({ name, price: Number(price), image, category });
    res.status(201).json(newProduct);
  } catch (error) {
    res.status(500).json({ message: 'Error al crear producto', error: error.message });
  }
};