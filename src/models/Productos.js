const mongoose = require('mongoose');

const productoSchema = mongoose.Schema({
  nombre_producto: { type: String, required: true },
  descripcion: { type: String, required: true },
  color: { type: String, required: true },
  precio_venta: { type: Number, required: true },
  costo_produccion: { type: Number, required: true },
  precio_promocional: { type: Number, default: 0 },
  stock_disponible: { type: Number, required: true },
  margen_ganancia: { type: Number, required: true },
  imagen: { type: String, required: true },
});

module.exports = mongoose.model('Producto', productoSchema);
