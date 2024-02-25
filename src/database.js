const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/angular-auth')
    .then(() => console.log('Conectado a la basde de datos'))
    .catch(err => console.error(err));
