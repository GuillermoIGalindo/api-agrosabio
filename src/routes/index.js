const {Router} = require('express');
const User = require('../models/User');
const router = Router();


const jwt = require('jsonwebtoken');

router.post('/signup', async (req, res) => {
    const {name, lastname, email, password} = (req.body); // recibir los datos que se envian desde el front
    console.log(email, password);

    const newUser = new User({name, lastname, email, password}); // crear un nuevo usuario en la base de datos
    await newUser.save(); // guardar el nuevo usuario

    const token = jwt.sign({_id: newUser._id}, 'secretkey'); // crear un token para el usuario
    res.status(200).json({token}); // enviar el token al front

    console.log(newUser);
});

router.post('/signin', async (req, res) => {// crear un nuevo usuario en la base de datos

    const {email, password} = (req.body); // recibir los datos del usuario 

    const user = await User.findOne({email}); // buscar el usuario  por correo en la base de datos
    if (!user) return res.status(401).send("El correo no existe");
    if (user.password !== password) return res.status(401).send("Contraseña incorrecta");

    const token = jwt.sign({_id: user._id}, 'secretkey'); // crear un token para el usuario
    //return res.status(200).json({token}); // enviar el token al front
    res.cookie('token', token, {httpOnly: true});
    return res.status(200).json({token});
}); 

//destruccion del token
router.post('/signout', (req, res) => {
  res.clearCookie('token').json({message: 'Session closed successfully'});
});


router.get('/profile', verifyToken, (req, res) => {
    res.send(req.userId);
}); 


function verifyToken(res, req, next){ // verificar el token en la cabecera de la petición de tasks privadas
    if (!req.headers.authorization){
        return res.status(401).send('Autorización negada');
    }
    const token = req.headers.authorization.split(' ')[1];
    if (token === 'null'){
        return res.status(401).send('Autorización negada');
    }

    const payload = jwt.verify(token, 'secretkey');
    req.userId = payload._id;
    next();

}
// Obtener todos los usuarios
router.get('/users', async (req, res) => {
    try {
      // Buscar todos los usuarios en la colección
      const users = await User.find();
      // Enviar la respuesta con los usuarios encontrados
      res.json(users);
    } catch (error) {
      // Manejar los posibles errores
      res.status(500).json({ error: 'Error al obtener los usuarios' });
    }
  });

// Crear un usuario
router.post('/user', async (req, res) => {
  try {
    const user = await createUser(req.body);
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el usuario' });
  }
});
module.exports = router;




