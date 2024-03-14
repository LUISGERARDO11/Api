const express = require('express');
const Contacto = require('../models/Contactos'); // Importa el modelo Contacto si está definido en otro archivo

const router = express.Router();

// Obtener todos los contactos
router.get('/contacto', async (req, res) => {
  try {
    const contactos = await Contacto.find();
    res.json(contactos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo contactos' });
  }
});

// Obtener un contacto específico por _id
router.get('/contacto/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const contacto = await Contacto.findById(id);
    res.json(contacto);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo contacto' });
  }
});

// Agregar un nuevo contacto
router.post('/contacto', async (req, res) => {
  const contactoData = req.body;

  try {
    const nuevoContacto = new Contacto(contactoData);
    const savedContacto = await nuevoContacto.save();
    res.status(201).json(savedContacto);
  } catch (error) {
    res.status(500).json({ message: 'Error creando contacto' });
  }
});

// Actualizar un contacto específico por _id
router.put('/contacto/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedContacto = await Contacto.findByIdAndUpdate(id, newData, { new: true });
    res.json(updatedContacto);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando contacto' });
  }
});

// Eliminar un contacto específico por _id
router.delete('/contacto/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Contacto.findByIdAndDelete(id);
    res.json({ message: 'Contacto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando contacto' });
  }
});

module.exports = router;
