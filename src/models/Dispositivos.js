const mongoose = require('mongoose');

const dispositivoSchema = new mongoose.Schema({
  clave: {
    type: String,
    required: true
  },
  nombre: { 
    type: String, 
    required: true 
  },
  estado: {
    type: String,
    required: true,
    enum: ['Activo', 'Inactivo']
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario'
  },
  temperatura: {
    type: Number, // Tipo de dato para la temperatura (podría ser otro dependiendo de tus necesidades)
    default: null // Valor por defecto si no se proporciona la temperatura
  },
  humedad: {
    type: Number, // Tipo de dato para la humedad (podría ser otro dependiendo de tus necesidades)
    default: null // Valor por defecto si no se proporciona la humedad
  },
  fecha_actualizacion: {
    type: Date,
    default: Date.now 
  }
});

const DispositivoModel = mongoose.model('Dispositivo', dispositivoSchema);

module.exports = DispositivoModel;
