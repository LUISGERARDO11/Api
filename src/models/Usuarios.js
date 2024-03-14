const mongoose = require('mongoose');

const userSchema = mongoose.Schema({
  nombre_completo: { type: String, required: true },
  correo: { type: String, required: true, unique: true },
  tipo: { type: String, required: true },
  contrasenia: { type: String, required: true },
  pregunta_secreta: { type: String, required: true },
  respuesta_secreta: { type: String, required: true },
  token_acceso: { type: String, required: true },
  fecha_registro: { type: Date, required: true },
  direccion: {
    pais: { type: String, required: true },
    estado: { type: String, required: true },
    ciudad: { type: String, required: true },
    colonia: { type: String, required: true },
    calle: { type: String, required: true },
    codigo_postal: { type: String, required: true },
    referencia: { type: String, required: true }
  },
  telefono: { type: String, required: true },
  dispositivos: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Dispositivos' }]
});

module.exports = mongoose.model('Usuario', userSchema);
