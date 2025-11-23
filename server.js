const express = require('express');
const cors = require('cors');
const db = require('./models');


const authRoutes = require('./routes/authRoutes');
const productRoutes = require('./routes/productRoutes');
const orderRoutes = require('./routes/orderRoutes');
const userRoutes = require('./routes/userRoutes');          
const dashboardRoutes = require('./routes/dashboardRoutes'); 
const paymentRoutes = require('./routes/paymentRoutes');

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
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes);           
app.use('/api/dashboard', dashboardRoutes);  
app.use('/api/payment', paymentRoutes);


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