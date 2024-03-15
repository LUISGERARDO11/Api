const mongoose = require('mongoose');

const politicachema = mongoose.Schema({
  titulo: { type: String, required: true },
  descripcion: { type: String, required: true },
  fecha_actualizacion: {type: Date, default: Date.now , required: true },
  image: {type: String, required: false },
});

module.exports = mongoose.model('Politica', politicachema);
