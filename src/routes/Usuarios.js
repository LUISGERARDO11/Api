const express = require('express');
const bcrypt = require('bcrypt'); // Librería para encriptar contraseñas
const esquema = require('../models/Usuarios');

const router = express.Router();

// Crear un usuario
router.post('/usuarios', async (req, res) => {
  try {
    const { contrasenia, ...userData } = req.body; // Excluir la contraseña del objeto userData
    const hashedPassword = await bcrypt.hash(contrasenia, 10); // Encriptar la contraseña
    const usuario = new esquema({ ...userData, contrasenia: hashedPassword }); // Usar la contraseña encriptada
    const savedUser = await usuario.save();
    res.json(savedUser);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Manejo específico de errores
  }
});

// Leer usuarios
router.get('/usuarios', async (req, res) => {
  try {
    const users = await esquema.find().select('-contrasenia -pregunta_secreta -respuesta_secreta'); // Excluir campos sensibles
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Manejo específico de errores
  }
});

// Buscar usuario por ID
router.get('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const user = await esquema.findById(id).select('-contrasenia -pregunta_secreta -respuesta_secreta'); // Excluir campos sensibles
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message }); // Manejo específico de errores
  }
});

router.get('/usuarios/email/:correo', async (req, res) => {
    try {
      const { correo } = req.params;
      const usuario = await esquema.findOne({ correo }).select('-contrasenia -pregunta_secreta -respuesta_secreta'); // Excluir campos sensibles
      const exists = usuario !== null;
      res.json({ exists, usuario }); // Devuelve un objeto con la propiedad "exists" y los datos del usuario sin información sensible
    } catch (error) {
      res.status(500).json({ message: 'Error al buscar usuario', error }); // Manejo específico de errores
    }
  });

// Método para verificar si existe un usuario con el correo, pregunta secreta y respuesta secreta
router.post('/usuarios/verify', async (req, res) => {
  try {
    const { correo, pregunta_secreta, respuesta_secreta } = req.body;
    const usuario = await esquema.findOne({ correo });

    if (usuario && await bcrypt.compare(respuesta_secreta, usuario.respuesta_secreta)) {
      res.json({ exists: true });
    } else {
      res.json({ exists: false });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar usuario', error }); // Manejo específico de errores
  }
});

// Inicio de sesión
router.post('/usuarios/login', async (req, res) => {
  try {
    const { correo, contrasenia } = req.body;
    const usuario = await esquema.findOne({ correo });

    if (usuario && await bcrypt.compare(contrasenia, usuario.contrasenia)) {
      res.json({ message: 'Inicio de sesión exitoso', usuario });
    } else {
      res.status(404).json({ message: 'Correo electrónico o contraseña incorrectos' });
    }
  } catch (error) {
    res.status(500).json({ message: 'Error al buscar usuario', error }); // Manejo específico de errores
  }
});

// Eliminar usuario por ID
router.delete('/usuarios/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedUser = await esquema.findByIdAndDelete(id);
    res.json({ message: 'Usuario eliminado correctamente', usuarioEliminado: deletedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al eliminar usuario', error }); // Manejo específico de errores
  }
});

// Actualizar todos los campos de la dirección
router.put('/usuarios/direccion/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const newDireccion = req.body;
    const updatedUser = await esquema.findByIdAndUpdate(id, { $set: { direccion: newDireccion } }, { new: true }); // Actualizar solo la propiedad "direccion"
    res.json({ message: 'Dirección actualizada correctamente', usuarioActualizado: updatedUser });
  } catch (error) {
    res.status(500).json({ message: 'Error al actualizar dirección del usuario', error }); // Manejo específico de errores
  }
});

router.put('/usuarios/datos/:id', async (req, res) => {
    try {
      const { id } = req.params;
      const { nombre_completo, telefono, correo } = req.body;
      const updatedUser = await esquema.findByIdAndUpdate(id, { $set: { nombre_completo, telefono, correo } }, { new: true });
      res.json({ message: 'Nombre, teléfono y correo actualizados correctamente', usuarioActualizado: updatedUser });
    } catch (error) {
      res.status(500).json({ message: 'Error al actualizar nombre, teléfono y correo del usuario', error }); // Manejo específico de errores
    }
  });