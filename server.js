const express = require('express');
const cors = require('cors');
const db = require('./models');

// Importar rutas
const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes'); // <--- NUEVA RUTA IMPORTADA

const app = express();
const PORT = process.env.PORT || 3001;

// Middlewares
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Ruta base
app.get('/api', (req, res) => {
    res.json({ message: 'Bienvenido al backend de BlackMarkPet API.' });
});

// Usar rutas
app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);
app.use('/api/orders', orderRoutes); // <--- REGISTRAR LA RUTA DE ÓRDENES

// Sincronizar BD y arrancar servidor
db.sequelize.sync()
    .then(() => {
        console.log('Base de datos sincronizada correctamente.');
        app.listen(PORT, () => {
            console.log(`[BlackMarkPet API] Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('No se pudo conectar a la base de datos:', err);
    });