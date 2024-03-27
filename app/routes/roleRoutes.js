const express = require('express');
const router = express.Router();
const { signup, signin, checkEmail, updatePassword, getAllUsers, 
updateUser, deleteUser, getUser
} = require('../controllers/usersController');
const { getRole} = require('../controllers/roleController');
const { verifyToken } = require('../middleware/authMiddleware');
const logger = require('../config/logger');


router.get('/allRoles', getRole);


router.get('/', (req, res) => {
    res.send('Bienvenido a la API');
  });

module.exports = router;
