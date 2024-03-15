const express = require('express');
const Producto = require('../models/Productos'); // Importa el modelo Producto si está definido en otro archivo

const router = express.Router();

// Obtener todos los productos
router.get('/producto', async (req, res) => {
  try {
    const productos = await Producto.find();
    res.json(productos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo productos' });
  }
});

// Obtener un producto específico por _id
router.get('/producto/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const producto = await Producto.findById(id);
    res.json(producto);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo producto' });
  }
});

// Agregar un nuevo producto
router.post('/producto', async (req, res) => {
  const productoData = req.body;

  try {
    const nuevoProducto = new Producto(productoData);
    const savedProducto = await nuevoProducto.save();
    res.status(201).json(savedProducto);
  } catch (error) {
    res.status(500).json({ message: 'Error creando producto' });
  }
});

// Actualizar un producto específico por _id
router.put('/producto/:id', async (req, res) => {
  const id = req.params.id;
  const newData = req.body;

  try {
    const updatedProducto = await Producto.findByIdAndUpdate(id, newData, { new: true });
    res.json(updatedProducto);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando producto' });
  }
});

// Eliminar un producto específico por _id
router.delete('/producto/:id', async (req, res) => {
  const id = req.params.id;

  try {
    await Producto.findByIdAndDelete(id);
    res.json({ message: 'Producto eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando producto' });
  }
});

module.exports = router;
