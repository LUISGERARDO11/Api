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


router.get('/usuarios/email/:correo', (req, res) => {
    const { correo } = req.params;
    esquema.findOne({ correo })
      .then(data => {
        // Verifica si se encontró un usuario con el correo proporcionado
        const exists = data !== null;
        res.json({ exists, data }); // Devuelve un objeto con la propiedad "exists" y los datos del usuario
      })
      .catch(error => res.status(500).json({ message: error }));
});

// Método para verificar si hay un documento con el correo, pregunta secreta y respuesta secreta
router.post('/usuarios/verify', (req, res) => {
    const { correo, pregunta_secreta, respuesta_secreta } = req.body;

    esquema.findOne({ correo, pregunta_secreta, respuesta_secreta })
        .then(usuario => {
            if (usuario) {
                res.json({ exists: true });
            } else {
                res.json({ exists: false });
            }
        })
        .catch(error => res.status(500).json({ message: 'Error al buscar usuario', error }));
});

  
//Login
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
// Actualizar todos los campos de la dirección
router.put('/usuarios/direccion/:id', (req, res) => {
  const { id } = req.params;
  const newDireccion = req.body;

  esquema.findByIdAndUpdate(id, { direccion: newDireccion }, { new: true })
      .then(updatedUser => {
          if (updatedUser) {
              res.json({ message: 'Dirección actualizada correctamente', usuarioActualizado: updatedUser });
          } else {
              res.status(404).json({ message: 'No se encontró ningún usuario con el ID proporcionado' });
          }
      })
      .catch(error => res.status(500).json({ message: 'Error al actualizar dirección del usuario', error }));
});

// Actualizar nombre, teléfono y correo
router.put('/usuarios/datos/:id', (req, res) => {
  const { id } = req.params;
  const { nombre_completo, telefono, correo } = req.body;

  esquema.findByIdAndUpdate(id, { nombre_completo, telefono, correo }, { new: true })
      .then(updatedUser => {
          if (updatedUser) {
              res.json({ message: 'Nombre, teléfono y correo actualizados correctamente', usuarioActualizado: updatedUser });
          } else {
              res.status(404).json({ message: 'No se encontró ningún usuario con el ID proporcionado' });
          }
      })
      .catch(error => res.status(500).json({ message: 'Error al actualizar nombre, teléfono y correo del usuario', error }));
});


module.exports=router