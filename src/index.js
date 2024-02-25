const express = require('express');
const app = express();
const cors= require('cors');

require('./database');

app.use(cors());
app.use(express.json()); // para que entienda los datos que le enviamos en formato de json
app.use('/api',require('./routes/index'));

app.listen(3000);
console.log('Servidor en el puerto', 3000);