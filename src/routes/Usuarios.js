const express=require('express')
const esquema=require('../models/Usuarios')

const router=express.Router()

//crear un usuario
router.post('/usuarios',(req,res)=>{
    const us= esquema(req.body);
    us.save()
    .then(data=>res.json(data))
    .catch(error=>res.json({message:error}))
})

//leer usuarios
router.get('/usuarios',(req,res)=>{
    esquema.find()
    .then(data=>res.json(data))
    .catch(error=>res.json({message:error}))
})

//buscar usuario
router.get('/usuarios/:id',(req,res)=>{
    const {id}=req.params
    esquema.findById(id)
    .then(data=>res.json(data))
    .catch(error=>res.json({message:error}))
})

//busqueda por elmail
router.get('/usuarios/email/:email',(req,res)=>{
    const {email} = req.params
    esquema.findOne({ email })
      .then(data => res.json(data))
      .catch(error => res.json({message:error}))
  })
  

  router.post('/usuarios/login', (req, res) => {
    const { correo, contrasenia } = req.body;
  
    esquema.findOne({ correo, contrasenia })
      .then(usuario => {
        if (usuario) {
          res.json({ message: 'Inicio de sesión exitoso', usuario });
        } else {
          res.status(404).json({ message: 'Correo electrónico o contraseña incorrectos' });
        }
      })
      .catch(error => res.status(500).json({ message: 'Error al buscar usuario', error }));
  });

module.exports=router