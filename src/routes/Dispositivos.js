const express = require('express');
const DispositivoModel = require('../models/Dispositivos'); // Importa el modelo Dispositivo si está definido en otro archivo

const router = express.Router();

// Obtener todos los dispositivos
router.get('/dispositivo', async (req, res) => {
  try {
    const dispositivos = await DispositivoModel.find();
    res.json(dispositivos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo dispositivos' });
  }
});

// Obtener un dispositivo específico por _id
router.get('/dispositivo/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const dispositivo = await DispositivoModel.findById(id);
    if (!dispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json(dispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo dispositivo' });
  }
});

// Agregar un nuevo dispositivo
router.post('/dispositivo', async (req, res) => {
  const { clave,nombre, ubicacion, estado, usuario_id } = req.body;

  if ( !clave || !nombre || !ubicacion || !estado || !usuario_id) {
    return res.status(400).json({ message: 'Por favor, proporcione nombre, ubicacion, estado y usuario_id' });
  }

  const newDispositivo = new DispositivoModel({ clave, nombre, ubicacion, estado, usuario_id });

  try {
    const savedDispositivo = await newDispositivo.save();
    res.status(201).json(savedDispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error creando dispositivo' });
  }
});

// Actualizar un dispositivo específico por _id
router.put('/dispositivo/:id', async (req, res) => {
  const { id } = req.params;
  const { clave, nombre, ubicacion, estado, usuario_id } = req.body;

  if ( !clave || !nombre || !ubicacion || !estado || !usuario_id) {
    return res.status(400).json({ message: 'Por favor, proporcione nombre, ubicacion, estado y usuario_id' });
  }

  const update = { clave, nombre, ubicacion, estado, usuario_id };

  try {
    const updatedDispositivo = await DispositivoModel.findByIdAndUpdate(id, update, { new: true });
    if (!updatedDispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json(updatedDispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando dispositivo' });
  }
});

// Eliminar un dispositivo específico por _id
router.delete('/dispositivo/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDispositivo = await DispositivoModel.findByIdAndDelete(id);
    if (!deletedDispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json({ message: 'Dispositivo eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando dispositivo' });
  }
});

module.exports = router;
