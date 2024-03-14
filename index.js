const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const usuarioRoutes = require('./src/routes/Usuarios'); // Assumiendo que estos archivos existen
const faqRoutes = require('./src/routes/FAQ');
const contactoRoutes = require('./src/routes/Contactos');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rutas
app.use('/api', usuarioRoutes);
app.use('/api', faqRoutes);
app.use('/api', contactoRoutes);

app.get('/', (req, res) => {
  res.json({ "response": "esto es mi primer servidor" });
});

// Conexión a MongoDB
mongoose.connect(process.env.MONGO_URI, { dbName: 'smarthomesweepers' })
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(port, () => {
      console.log('Corriendo en el puerto ' + port);
    });
  })
  .catch(error => console.error('Error al conectar a MongoDB:', error));
