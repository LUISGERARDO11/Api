const mongoose = require('mongoose');

const faqSchema = new mongoose.Schema({
  pregunta: { 
    type: String, 
    required: true 
  },
  respuesta: {
    type: String,
    required: true
  },
  fecha_actualizacion: {
    type: Date,
    default: Date.now 
  },
});

const FAQModel = mongoose.model('FAQ', faqSchema);

module.exports = FAQModel;