const mongoose = require('mongoose');

// Definir el esquema para la colección sesiones_limpieza
const sesionLimpiezaSchema = new mongoose.Schema({
  clave_dispositivo: {
    type: String,
    required: true
  },
  tipo: {
    type: String,
    required: true
  },
  fecha_inicio: {
    type: Date,
    required: true
  },
  fecha_fin: {
    type: Date,
    default: null // Valor por defecto: null
  },
  resultado: {
    type: String,
    default: '' // Valor por defecto: cadena vacía
  },
  duracion: {
    type: Number,
    default: null // Valor por defecto: null
  },
  sensores: {
    ultrasonico: {
      type: Number,
      default: null // Valor por defecto: null
    },
    infrarrojo: {
      type: Number,
      default: null // Valor por defecto: null
    }
  }
});

// Crear el modelo de la colección sesiones_limpieza
const SesionLimpieza = mongoose.model('SesionLimpieza', sesionLimpiezaSchema);

// Exportar el modelo
module.exports = SesionLimpieza;
