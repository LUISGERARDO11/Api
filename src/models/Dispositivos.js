const mongoose = require('mongoose');

const dispositivoSchema = new mongoose.Schema({
  nombre: { 
    type: String, 
    required: true 
  },
  ubicacion: {
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
  fecha_actualizacion: {
    type: Date,
    default: Date.now 
  }
});

const DispositivoModel = mongoose.model('Dispositivo', dispositivoSchema);

module.exports = DispositivoModel;
