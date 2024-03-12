const express = require('express');
const router = express.Router();
const { signup, signin, checkEmail, updatePassword } = require('../controllers/usersController');
const { verifyToken } = require('../middleware/authMiddleware');
const logger = require('../config/logger');

// Ruta para el registro de usuarios
router.post('/signup', signup);

// Ruta para el inicio de sesión
router.post('/signin', signin);

// Ruta para cerrar sesión (Ejemplo, podría necesitar implementación específica)
router.post('/signout', (req, res) => {
    logger.info('Sesión cerrada correctamente');
   res.clearCookie('token').json({message: 'Sesión cerrada correctamente'});
});

// Ruta para verificar la existencia de un correo electrónico
router.post('/checkEmail', checkEmail);

// Ruta para actualizar la contraseña
router.post('/updatePassword', verifyToken, updatePassword);


module.exports = router;
