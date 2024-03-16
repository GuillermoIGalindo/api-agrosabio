const express = require('express');
const router = express.Router();
const { signup, signin, checkEmail, updatePassword } = require('../controllers/usersController');
const { verifyToken } = require('../middleware/authMiddleware');
const logger = require('../config/logger');


router.post('/signup', signup);

router.post('/signin',  signin);


router.post('/signout', (req, res) => {
    logger.info('Sesión cerrada correctamente');
   res.clearCookie('token').json({message: 'Sesión cerrada correctamente'});
});


router.post('/checkEmail', checkEmail);


router.post('/updatePassword', verifyToken, updatePassword);


module.exports = router;
