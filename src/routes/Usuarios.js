const express=require('express')
const bcrypt = require('bcrypt');
const esquema=require('../models/Usuarios')

const router=express.Router()

//crear un usuario
router.post('/usuarios', async (req, res) => {
    try {
        // Extraer la contraseña del cuerpo de la solicitud
        const { contrasenia, ...userData } = req.body;

        // Encriptar la contraseña
        const hashedPassword = await bcrypt.hash(contrasenia, 10); // El segundo parámetro es el número de rondas de hashing

        // Crear un nuevo objeto usuario con la contraseña encriptada
        const usuarioNuevo = new esquema({
            ...userData, // Utilizamos el resto de los datos del cuerpo de la solicitud
            contrasenia: hashedPassword // Contraseña encriptada
        });

        // Guardar el usuario en la base de datos
        const usuarioGuardado = await usuarioNuevo.save();
        res.json(usuarioGuardado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

//leer usuarios
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await esquema.find({}, '-contrasenia -pregunta_secreta -respuesta_secreta');
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: 'Error al obtener usuarios', error: error.message });
    }
});


//buscar usuario
router.get('/usuarios/:id',(req,res)=>{
    const {id}=req.params
    esquema.findById(id)
    .then(data=>res.json(data))
    .catch(error=>res.json({message:error}))
})


router.get('/usuarios/email/:correo', async (req, res) => {
    const { correo } = req.params;

    try {
        // Buscar el usuario por correo electrónico
        const usuario = await esquema.findOne({ correo });

        // Verificar si se encontró un usuario con el correo proporcionado
        if (usuario) {
            // Si el usuario existe, devolver la pregunta secreta y el _id junto con exists
            res.json({ exists: true, pregunta_secreta: usuario.pregunta_secreta, _id: usuario._id,token:usuario.token_acceso });
        } else {
            // Si el usuario no existe, simplemente devolver exists como false
            res.json({ exists: false });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al buscar usuario', error: error.message });
    }
});



// Expresión regular para verificar que la contraseña cumple con los requisitos
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;


router.put('/usuarios/actualizarcontrasena/:id', async (req, res) => {
    const { id } = req.params;
    const { nuevaContrasena } = req.body;

    try {
        // Validar que la nueva contraseña cumple con los requisitos
        if (!passwordRegex.test(nuevaContrasena)) {
            return res.status(400).json({ success: false, message: 'La nueva contraseña no cumple con los requisitos' });
        }

        // Encriptar la nueva contraseña antes de almacenarla en la base de datos
        const hashedPassword = await bcrypt.hash(nuevaContrasena, 10);

        // Actualizar la contraseña del usuario en la base de datos
        const usuarioActualizado = await esquema.findByIdAndUpdate(id, { contrasenia: hashedPassword }, { new: true });

        if (usuarioActualizado) {
            res.json({ success: true, message: 'Contraseña actualizada correctamente' });
        } else {
            res.status(404).json({ success: false, message: 'Usuario no encontrado' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al actualizar la contraseña', error: error.message });
    }
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
router.post('/usuarios/login', async (req, res) => {
    const { correo, contrasenia } = req.body;

    try {
        // Buscar el usuario por correo electrónico
        const usuario = await esquema.findOne({ correo });

        if (usuario) {
            // Comparar la contraseña proporcionada con la contraseña encriptada almacenada
            const contraseñaValida = await bcrypt.compare(contrasenia, usuario.contrasenia);

            if (contraseñaValida) {
                // La contraseña es válida, inicio de sesión exitoso
                res.json({ message: 'Inicio de sesión exitoso', usuario });
            } else {
                // Contraseña incorrecta
                res.status(401).json({ message: 'Correo electrónico o contraseña incorrectos' });
            }
        } else {
            // No se encontró ningún usuario con el correo electrónico proporcionado
            res.status(404).json({ message: 'Correo electrónico o contraseña incorrectos' });
        }
    } catch (error) {
        // Error al buscar usuario en la base de datos
        res.status(500).json({ message: 'Error al buscar usuario', error });
    }
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