const express = require('express');
const cors = require('cors');
const app = express();
const connectDB = require('./config/db'); // Se usa la misma función para conectar a la DB
const connectAPIDB = require('./config/db');
const userRoutes = require('./routes/userRoutes');
const Role = require('./models/Role');
const logger = require('./config/logger');
const corsOptions = require('./config/corsOptions');
require('dotenv').config();

// Conexión a la base de datos
connectAPIDB();

// Inicialización de roles si no existen
async function initialSetup() {
    try {
        const roles = await Role.find();
        if (roles.length === 0) {
            await new Role({ name: 'usuario' }).save();
            await new Role({ name: 'administrador' }).save();
            logger.info('Roles de usuario inicializados');
        }
    } catch (error) {
        logger.error('Error al inicializar roles: ' + error.message);
    }
}

initialSetup();

// Configuración de CORS
//app.use(cors(corsOptions));
app.use(cors());
// Middleware para interpretar JSON
app.use(express.json());
// Ruta de bienvenida (debes asegurarte de que esta definición sea accesible antes de definir otras rutas)
app.get('/', (req, res) => {
    res.send('Bienvenido a la API');
});

// Definición de rutas específicas
app.use('/api', userRoutes);

// Middleware para manejar rutas no encontradas
app.use((req, res, next) => {
    res.status(404).send('La página que buscas no existe, pero aquí te redirigimos a una ruta por defecto.');
});

// Otra opción es definir una ruta por defecto antes del middleware de captura.
// Esta ruta atendería a cualquier solicitud no capturada previamente.
app.use('*', (req, res) => {
    res.redirect('/');
});

// Inicio del servidor
app.listen(3000, () => {
    logger.info('Servidor corriendo en el puerto 3000');
});
