const { Product } = require('../models');

exports.getAllProducts = async (req, res) => {
    try {
        const products = await Product.findAll();
        res.json(products);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener productos', error: error.message });
    }
};

exports.getProductById = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado' });
        }
        
        res.json(product);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener el producto', error: error.message });
    }
};

exports.createProduct = async (req, res) => {
    try {
        const { name, price, image, category } = req.body;

        
        if (!name || !price || !image) {
            return res.status(400).json({ message: 'Nombre, precio e imagen son obligatorios' });
        }

        
        const categoryToSave = category || 'General';

        const newProduct = await Product.create({ 
            name, 
            price, 
            image, 
            category: categoryToSave 
        });
        
        res.status(201).json(newProduct);
    } catch (error) {
        console.error("Error al crear producto:", error); 
        res.status(500).json({ message: 'Error al crear producto', error: error.message });
    }
};

exports.updateProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, image, category } = req.body;
        
        const product = await Product.findByPk(id);
        
        if (!product) {
            return res.status(404).json({ message: 'Producto no encontrado para actualizar' });
        }

        await product.update({ name, price, image, category });
        
        res.json({ message: 'Producto actualizado correctamente', product });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar producto', error: error.message });
    }
};

exports.deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await Product.destroy({ where: { id } });

        if (!deleted) {
            return res.status(404).json({ message: 'Producto no encontrado para eliminar' });
        }

        res.json({ message: 'Producto eliminado correctamente' });
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar producto', error: error.message });
    }
};