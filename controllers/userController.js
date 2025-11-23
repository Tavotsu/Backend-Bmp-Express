const bcrypt = require('bcryptjs');
const db = require('../models');
const User = db.User;


exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.findAll({
            attributes: { exclude: ['password'] }
        });
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
};


exports.createUser = async (req, res) => {
    try {
        const { name, email, password, role } = req.body;

       
        if (!name || !email || !password) {
            return res.status(400).json({ message: 'Faltan datos obligatorios' });
        }

        
        const hashedPassword = await bcrypt.hash(password, 10);

        const newUser = await User.create({
            name,
            email,
            password: hashedPassword,
            role: role || 'cliente'
        });

        res.status(201).json({ message: 'Usuario creado exitosamente', user: newUser });
    } catch (error) {
        res.status(500).json({ message: 'Error al crear usuario', error: error.message });
    }
};


exports.updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { name, email, role } = req.body;

        const user = await User.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: 'Usuario no encontrado' });
        }

        await user.update({ name, email, role });
        res.json({ message: 'Usuario actualizado correctamente', user });
    } catch (error) {
        res.status(500).json({ message: 'Error al actualizar usuario', error: error.message });
    }
};


exports.deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const deleted = await User.destroy({ where: { id } });

        if (deleted) {
            res.status(200).json({ message: 'Usuario eliminado correctamente' });
        } else {
            res.status(404).json({ message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error: error.message });
    }
};