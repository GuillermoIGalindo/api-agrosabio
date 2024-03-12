const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const Role = require('../models/Role');
const logger = require('../config/logger'); // Asegúrate de que la ruta al logger sea correcta
const saltRounds = 10;

exports.signup = async (req, res) => {
    const { name, lastname, email, password, roleName } = req.body;

    try {
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            logger.warn(`Intento de registro con correo existente: ${email}`);
            return res.status(400).send('El usuario ya existe con ese correo electrónico.');
        }

        const role = await Role.findOne({ name: roleName });
        if (!role) {
            logger.warn(`Intento de registro con rol no válido: ${roleName}`);
            return res.status(400).send('Rol no válido.');
        }

        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const newUser = new User({ name, lastname, email, password: hashedPassword, role: role._id });
        await newUser.save();

        const token = jwt.sign({ _id: newUser._id, role: role.name }, 'secretkey');
        logger.info(`Nuevo usuario registrado: ${email}`);
        res.status(201).json({ token });
    } catch (error) {
        logger.error(`Error al registrar el usuario: ${error.message}`);
        res.status(500).json({ error: 'Error al registrar el usuario', details: error.message });
    }
};

exports.signin = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Intento de inicio de sesión con correo no existente: ${email}`);
            return res.status(401).send("El correo no existe");
        }

        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            logger.warn(`Intento de inicio de sesión con contraseña incorrecta: ${email}`);
            return res.status(401).send("Contraseña incorrecta");
        }

        const token = jwt.sign({ _id: user._id }, 'secretkey');
        logger.info(`Inicio de sesión exitoso: ${email}`);
        res.cookie('token', token, { httpOnly: true });
        return res.status(200).json({ token });
    } catch (error) {
        logger.error(`Error al iniciar sesión: ${error.message}`);
        res.status(500).json({ error: 'Error al iniciar sesión', details: error.message });
    }
};

exports.signout = (req, res) => {
    res.clearCookie('token').json({message: 'Sesión cerrada correctamente'});
};

exports.checkEmail = async (req, res) => {
    const { email } = req.body;

    try {
        const user = await User.findOne({ email });
        if (user) {
            logger.info(`Verificación de correo existente: ${email}`);
            res.status(200).json({ message: 'El correo existe' });
        } else {
            logger.info(`Verificación de correo no existente: ${email}`);
            res.status(404).json({ message: 'El correo no existe' });
        }
    } catch (error) {
        logger.error(`Error al buscar el correo: ${error.message}`);
        res.status(500).json({ error: 'Error al buscar el correo', details: error.message });
    }
};

exports.updatePassword = async (req, res) => {
    const { email, newPassword } = req.body;

    try {
        const user = await User.findOne({ email });
        if (!user) {
            logger.warn(`Intento de actualizar contraseña para correo no encontrado: ${email}`);
            return res.status(404).send('Usuario no encontrado con ese correo electrónico.');
        }

        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);
        user.password = hashedPassword;
        await user.save();

        logger.info(`Contraseña actualizada correctamente para: ${email}`);
        res.status(200).send('Contraseña actualizada correctamente.');
    } catch (error) {
        logger.error(`Error al actualizar la contraseña: ${error.message}`);
        res.status(500).json({ error: 'Error al actualizar la contraseña', details: error.message });
    }
};
