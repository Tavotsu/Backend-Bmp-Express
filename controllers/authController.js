const db = require('../models');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = db.User;
const JWT_SECRET = 'tu_secreto_jwt_muy_seguro'; // TODO: Hay que cambiar esto! - Tavo

// Validación de Registro (movida desde PaginaRegistro.jsx)
const validatePassword = (password) => {
  const regex = /^(?=.*[A-Za-z])(?=.*\d)(?=.*[^A-Za-z\d]).{8,}$/;
  return regex.test(password);
};

const validateEmail = (email) => {
  // Permitimos admin y los dominios de duoc
  const allowedDomains = ['duocuc.cl', 'profesor.duoc.cl', 'admin@blackmarkpet.cl']; 
  const domain = email.split('@')[1];
  return allowedDomains.includes(domain) || email === 'admin@blackmarkpet.cl';
};

// Controlador de Registro
exports.register = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Validaciones
    if (name.length < 4) {
      return res.status(400).json({ message: 'El nombre debe tener al menos 4 caracteres.' });
    }
    if (!validateEmail(email)) {
      return res.status(400).json({ message: 'El correo debe pertenecer a @duocuc.cl o @profesor.duoc.cl.' });
    }
    if (!validatePassword(password)) {
      return res.status(400).json({ message: 'La contraseña debe tener al menos 8 caracteres, e incluir letra, número y símbolo.' });
    }

    // Verificar si el usuario ya existe
    const existingUser = await User.findOne({ where: { email: email } });
    if (existingUser) {
      return res.status(400).json({ message: 'El correo electrónico ya está registrado.' });
    }

    // Hashear contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Determinar rol
    const role = (email === 'admin@blackmarkpet.cl') ? 'admin' : 'user';

    // Crear usuario
    const newUser = await User.create({
      name,
      email,
      password: hashedPassword,
      role
    });

    res.status(201).json({ message: 'Usuario registrado con éxito.' });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al registrar', error: error.message });
  }
};

// Controlador de Login
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Buscar usuario
    const user = await User.findOne({ where: { email: email } });
    if (!user) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }

    // Comparar contraseña
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Correo o contraseña incorrectos.' });
    }
    
    // Si el admin@blackmarkpet.cl se loguea, aseguramos su rol
    if (user.email === 'admin@blackmarkpet.cl' && user.role !== 'admin') {
        user.role = 'admin';
        await user.save();
    }

    // Crear Token (JWT)
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '8h' } // El token expira en 8 horas
    );

    // Enviar respuesta
    res.status(200).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role
      }
    });

  } catch (error) {
    res.status(500).json({ message: 'Error en el servidor al iniciar sesión', error: error.message });
  }
};