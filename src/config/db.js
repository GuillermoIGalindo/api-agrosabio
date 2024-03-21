const mongoose = require('mongoose');
const logger = require('./logger');

const connectDB = async () => {
    try {
        await mongoose.connect('mongodb://localhost/api-agrosabio');
        logger.info('Conectado a la base de datos');
    } catch (err) {
        logger.error('Error de conexión a la base de datos: ' + err.message);
        //process.exit(1); // Detiene la aplicación si no puede conectarse a la base de datos
    }
};

module.exports = connectDB;
const connectAPIDB = async () => {
    const dbURI = process.env.MONGO_URI; // Utiliza la variable de entorno MONGO_URI
    try {
        await mongoose.connect(dbURI, { useNewUrlParser: true, useUnifiedTopology: true });
        logger.info('Conectado a la base de datos');
    } catch (err) {
        logger.error('Error de conexión a la base de datos: ' + err.message);
        process.exit(1); // Detiene la aplicación si no puede conectarse a la base de datos
    }
};

module.exports = connectAPIDB;