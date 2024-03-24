const express = require('express');
const router = express.Router();
const SesionLimpieza = require('../models/Sesiones_limpieza');

// Ruta para obtener todas las sesiones de limpieza
router.get('/sesiones_limpieza', async (req, res) => {
  try {
    const sesiones = await SesionLimpieza.find();
    res.json(sesiones);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener las sesiones de limpieza', error: error.message });
  }
});

// Ruta para agregar una nueva sesión de limpieza
router.post('/sesiones_limpieza', async (req, res) => {
  try {
    const nuevaSesion = new SesionLimpieza(req.body);
    const sesionGuardada = await nuevaSesion.save();
    res.status(201).json(sesionGuardada);
  } catch (error) {
    res.status(400).json({ message: 'Error al agregar la sesión de limpieza', error: error.message });
  }
});

// Ruta para actualizar una sesión de limpieza por su ID
router.put('/sesiones_limpieza/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const sesionActualizada = await SesionLimpieza.findByIdAndUpdate(id, req.body, { new: true });
    res.json(sesionActualizada);
  } catch (error) {
    res.status(400).json({ message: 'Error al actualizar la sesión de limpieza', error: error.message });
  }
});

// Ruta para eliminar una sesión de limpieza por su ID
router.delete('/sesiones_limpieza/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await SesionLimpieza.findByIdAndDelete(id);
    res.json({ message: 'Sesión de limpieza eliminada correctamente' });
  } catch (error) {
    res.status(400).json({ message: 'Error al eliminar la sesión de limpieza', error: error.message });
  }
});

module.exports = router;
