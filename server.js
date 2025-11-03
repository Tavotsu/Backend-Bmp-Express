const express = require('express');
const cors = require('cors');
const db = require('./models');

const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/api', (req, res) => {
    res.json({ message: 'Bienvenido al backend de BlackMarkPet API.' });
});

app.use('/api/auth', authRoutes);
app.use('/api/productos', productRoutes);

db.sequelize.sync()
    .then(() => {
        app.listen(PORT, () => {
            console.log(`[BlackMarkPet API] Servidor corriendo en http://localhost:${PORT}`);
        });
    })
    .catch((err) => {
        console.error('No se pudo conectar a la base de datos:', err);
    });
