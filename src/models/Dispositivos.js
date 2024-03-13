const mongoose = require('mongoose');

const dispositivoSchema = mongoose.Schema({
  nombre: { type: String, required: true },
  ubicacion: { type: String, required: true },
  estado: { type: String, required: true, enum: ['Activo', 'Inactivo'] },
  usuario_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Usuario' }
});

module.exports = mongoose.model('Dispositivo', dispositivoSchema);
