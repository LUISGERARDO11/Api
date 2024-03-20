const express = require('express');
const Dispositivo = require('../models/Dispositivo'); // Importa el modelo Dispositivo si está definido en otro archivo

const router = express.Router();

// Obtener todos los dispositivos
router.get('/dispositivo', async (req, res) => {
  try {
    const dispositivos = await Dispositivo.find();
    res.json(dispositivos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo dispositivos' });
  }
});

// Obtener un dispositivo específico por _id
router.get('/dispositivo/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const dispositivo = await Dispositivo.findById(id);
    res.json(dispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo dispositivo' });
  }
});

// Agregar un nuevo dispositivo
router.post('/dispositivo', async (req, res) => {
    const dispositivoData = req.body;
  
    try {
      // Validación de campos obligatorios
      const requiredFields = ['nombre', 'ubicacion', 'estado', 'usuario_id'];
      for (const field of requiredFields) {
        if (!dispositivoData.hasOwnProperty(field)) {
          return res.status(400).json({ message: `El campo ${field} es obligatorio.` });
        }
      }
  
      // Crear un nuevo dispositivo
      const nuevoDispositivo = new Dispositivo(dispositivoData);
      const savedDispositivo = await nuevoDispositivo.save();
      res.status(201).json(savedDispositivo);
    } catch (error) {
      // Manejo de errores específicos
      if (error.name === 'ValidationError') {
        const errors = Object.values(error.errors).map(err => err.message);
        return res.status(400).json({ message: errors });
      }
      res.status(500).json({ message: 'Error creando dispositivo.' });
    }
  });
  

// Actualizar un dispositivo específico por _id
router.put('/dispositivo/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedDispositivo = await Dispositivo.findByIdAndUpdate(id, newData, { new: true });
    res.json(updatedDispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando dispositivo' });
  }
});

// Eliminar un dispositivo específico por _id
router.delete('/dispositivo/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Dispositivo.findByIdAndDelete(id);
    res.json({ message: 'Dispositivo eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando dispositivo' });
  }
});


module.exports = router;
