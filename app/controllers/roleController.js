const User = require('../models/User');
const Role = require('../models/Role');
const logger = require('../config/logger'); 
const saltRounds = 10;

exports.getRole = async (req, res) => {
    try {
        const roles = await Role.find(); // Encuentra todos los roles
        res.json(roles); // Envía la lista de roles
    } catch (error) {
        res.status(500).json({ message: error.message });
    }

}

exports.getAllUsers = async (req, res) => {
    try {
        const users = await User.find().populate('role'); // Encuentra todos los usuarios
        res.json(users); // Envía la lista 
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

exports.getUser = async (req, res) => { 
try {
    const user = await User.findById(req.params.id); // Encuentra el usuario por su id
    if(!user){
        return res.status(404).json({message: "Usuario no encontrado"});
    }
    res.json(user); // Envía el usuario como respuesta
} catch (error) {
    res.status(500).json({ message: error.message });
}

};

exports.updateUser = async (req, res) => {
    const { id } = req.params;
    const updateData = req.body;

    try {
        const updatedUser = await User.findByIdAndUpdate(id, updateData, { new: true });
        
        if (!updatedUser) {
            return res.status(404).json({ message: "Usuario no encontrado" });
        }
        
        res.json(updatedUser); // Enviar el usuario actualizado como respuesta
    } catch (error) {
        if (error.kind === 'ObjectId') {
            return res.status(400).json({ message: "ID de usuario no válido" });
        }
        res.status(500).json({ message: error.message });
    }
};

exports.deleteUser = async (req, res) => {
    const {id} = req.params;
    try {
        const user = await User.findByIdAndDelete(id);
        if(!user){
            return res.status(404).json({message: "Usuario no encontrado"});
        }
        return res.status(200).json({message: "Usuario eliminado"});
    } catch (error) {
        res.status(500).json({ message: error.message });  
    }
};