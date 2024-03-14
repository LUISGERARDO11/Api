const mongoose = require('mongoose');

const contactoSchema = mongoose.Schema({
  nombre_empresa: { type: String, required: true },
  rfc: { type: String, required: true },
  direccion: {
    pais: { type: String, required: true },
    estado: { type: String, required: true },
    ciudad: { type: String, required: true },
    colonia: { type: String, required: true },
    calle: { type: String, required: true },
    codigo_postal: { type: String, required: true }
  },
  telefono: { type: String, required: true },
  correo: { type: String, required: true },
  horario_atencion: { type: String, required: true },
  redes_sociales: [
    {
      nombre_red: { type: String, required: true },
      url: { type: String, required: true }
    }
  ],
  ultima_actualizacion: { type: Date, required: true }
});

module.exports = mongoose.model('Contacto', contactoSchema);
