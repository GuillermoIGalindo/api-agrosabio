const winston = require('winston');
const { format, transports } = winston;
const { combine, timestamp, printf, colorize, errors } = format;

// Personaliza el formato de salida de los logs
const myFormat = printf(({ level, message, timestamp, stack }) => {
  // Usamos stack para los errores, si está disponible; si no, usamos message
  return `${timestamp} ${level}: ${stack || message}`;
});

// Configuración del logger
const logger = winston.createLogger({
  // Aplica el formato a todos los logs
  format: combine(
    errors({ stack: true }), // Muestra el stack de errores
    colorize(), // Aplica colores según el nivel del log
    timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }), // Formato de la fecha
    myFormat // Usa el formato personalizado
  ),
  transports: [
    // Transporte para la consola
    new transports.Console({
      level: 'debug', // Muestra todos los niveles de logs en la consola, ajusta según necesidad
    }),
    // Transporte específico para logs de nivel 'error'
    new transports.File({
      filename: 'logs/error.log',
      level: 'error',
    }),
    // Transporte específico para logs de nivel 'warn'
    new transports.File({
      filename: 'logs/warn.log',
      level: 'warn',
    }),
    // Transporte específico para logs de nivel 'info'
    new transports.File({
      filename: 'logs/info.log',
      level: 'info',
    }),
    // Aquí podrías continuar agregando transportes para otros niveles como 'debug', 'verbose', etc.
  ],
});

module.exports = logger;
