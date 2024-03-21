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

// Definición de rutas
app.use('/api', userRoutes);

// Middleware para manejar rutas no encontradas y proporcionar una ruta por defecto
app.use((req, res, next) => {
    // Aquí puedes manejar la ruta por defecto.
    // Por ejemplo, redirigir al usuario a una ruta específica o devolver una respuesta por defecto.
    res.status(404).send('La página que buscas no existe, pero aquí te redirigimos a una ruta por defecto.');
  });
  
  // Otra opción es definir una ruta por defecto antes del middleware de captura.
  // Esta ruta atendería a cualquier solicitud no capturada previamente.
  app.use('*', (req, res) => {
    res.send('Esta es la ruta por defecto.');
  });

// Inicio del servidor
app.listen(3000, () => {
    logger.info('Servidor corriendo en el puerto 3000');
});
