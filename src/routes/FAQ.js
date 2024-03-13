const express = require('express');
const FAQModel = require('../models/FAQModel'); // Importa el modelo FAQ si está definido en otro archivo

const router = express.Router();

// Get all FAQs
router.get('/faq', async (req, res) => {
  try {
    const faqs = await FAQModel.find();
    res.json(faqs);
  } catch (error) {
    res.status(500).json({ message: 'Error getting FAQs' });
  }
});

// Get a specific FAQ by _id
router.get('/faq/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const respuesta = await FAQModel.findById(id); // Use the extracted id
    res.json(respuesta);
  } catch (error) {
    res.status(500).json({ message: 'Error getting FAQ' });
  }
});

// Add a new FAQ
router.post('/faq', async (req, res) => {
  const { pregunta, respuesta } = req.body;

  if (!pregunta || !respuesta) {
    return res.status(400).json({ message: 'Please provide both pregunta and respuesta' });
  }

  const newFAQ = new FAQModel({ pregunta, respuesta });

  try {
    const savedFAQ = await newFAQ.save();
    res.status(201).json(savedFAQ);
  } catch (error) {
    res.status(500).json({ message: 'Error creating FAQ' });
  }
});

// Update a specific FAQ by _id
router.put('/faq/:id', async (req, res) => {
  const { id } = req.params;
  const { pregunta, respuesta } = req.body;

  if (!pregunta || !respuesta) {
    return res.status(400).json({ message: 'Please provide both pregunta and respuesta' });
  }

  const update = { pregunta, respuesta }; // Update object

  try {
    const updatedFAQ = await FAQModel.findByIdAndUpdate(id, update, { new: true }); // Return updated document
    if (!updatedFAQ) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json(updatedFAQ);
  } catch (error) {
    res.status(500).json({ message: 'Error updating FAQ' });
  }
});

// Delete a specific FAQ by _id
router.delete('/faq/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedFAQ = await FAQModel.findByIdAndDelete(id);
    if (!deletedFAQ) {
      return res.status(404).json({ message: 'FAQ not found' });
    }
    res.json({ message: 'FAQ deleted' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting FAQ' });
  }
});

module.exports = router;
