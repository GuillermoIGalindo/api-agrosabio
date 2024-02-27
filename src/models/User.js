const  {Schema, model} =  require('mongoose');

const userSchema = new Schema({
    name: {
        type: String,
        required: true,
        minlength: [2, 'El nombre debe tener al menos 2 caracteres'],
        maxlength: [50, 'El nombre no puede tener más de 50 caracteres']
    },
    lastname: {
        type: String,
        required: true,
        minlength: [2, 'El apellido debe tener al menos 2 caracteres'],
        maxlength: [50, 'El apellido no puede tener más de 50 caracteres']
    },    
    email: {
        type: String,
        required: true,
        unique: true, // Asegurar unico el correo
        //match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Por favor, ingrese un correo electrónico válido']
    },    
    password: {
        type: String,
        required: true,
        minlength: [6, 'La contraseña debe tener al menos 6 caracteres'],
        maxlength: [16, 'La contraseña no puede tener más de 16 caracteres']
    },    
},{
    timestamps: true

});

module.exports =  model('User', userSchema);
