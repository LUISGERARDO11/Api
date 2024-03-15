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
          // Si el usuario existe y las credenciales son correctas, se devuelve un objeto con el token de acceso
          res.json({ success: true, accessToken: generateAccessToken(usuario) });
        } else {
          // Si las credenciales son incorrectas o el usuario no existe, se devuelve un mensaje de error
          res.status(404).json({ success: false, message: 'Correo electrónico o contraseña incorrectos' });
        }
      })
      .catch(error => res.status(500).json({ success: false, message: 'Error al buscar usuario', error }));
  });


  // Eliminar usuario por ID
router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;

    esquema.findByIdAndDelete(id)
        .then(data => {
            if (data) {
                res.json({ message: 'Usuario eliminado correctamente', usuarioEliminado: data });
            } else {
                res.status(404).json({ message: 'No se encontró ningún usuario con el ID proporcionado' });
            }
        })
        .catch(error => res.status(500).json({ message: 'Error al eliminar usuario', error }));
});


module.exports=router