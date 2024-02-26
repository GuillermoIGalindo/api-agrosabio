const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost/api-agrosabio')
    .then(() => console.log('Conectado a la basde de datos'))
    .catch(err => console.error(err));
