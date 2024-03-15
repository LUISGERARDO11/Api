const express = require('express');
const Politica = require('../models/Politicas');

const router = express.Router();

// Obtener todas las políticas
router.get('/politica', async (req, res) => {
  try {
    const politicas = await Politica.find();
    res.json(politicas);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo políticas' });
  }
});

// Obtener una política específica por _id
router.get('/politica/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const politica = await Politica.findById(id);
    res.json(politica);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo política' });
  }
});

// Agregar una nueva política
router.post('/politica', async (req, res) => {
  const politicaData = req.body;

  try {
    const nuevaPolitica = new Politica(politicaData);
    const savedPolitica = await nuevaPolitica.save();
    res.status(201).json(savedPolitica);
  } catch (error) {
    // Manejo de errores específicos
    if (error.name === 'ValidationError') {
      const errors = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ message: errors });
    }
    res.status(500).json({ message: 'Error creando política' });
  }
});

// Actualizar una política específica por _id
router.put('/politica/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedPolitica = await Politica.findByIdAndUpdate(id, newData, { new: true });
    res.json(updatedPolitica);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando política' });
  }
});

// Eliminar una política específica por _id
router.delete('/politica/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Politica.findByIdAndDelete(id);
    res.json({ message: 'Política eliminada' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando política' });
  }
});

module.exports = router;
