const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer'); // Importa nodemailer
require('dotenv').config();

const usuarioRoutes = require('./src/routes/Usuarios');
const faqRoutes = require('./src/routes/FAQ');
const contactoRoutes = require('./src/routes/Contactos');
const productoRoutes = require('./src/routes/Productos');
const politicaRoutes = require('./src/routes/Politicas');

const app = express();
const port = process.env.PORT || 3000;

// Middleware
app.use(express.json());

// Rutas
app.use('/api', usuarioRoutes);
app.use('/api', faqRoutes);
app.use('/api', contactoRoutes);
app.use('/api', productoRoutes);
app.use('/api', politicaRoutes);

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

// Función para enviar correo electrónico
const enviarCorreo = async (destinatario, asunto, cuerpo) => {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: destinatario,
    subject: asunto,
    text: cuerpo
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado con éxito a', destinatario);
  } catch (error) {
    console.error('Error al enviar correo electrónico:', error);
  }
};

// Ejemplo de uso
app.post('/enviarcorreo', async (req, res) => {
  const { destinatario, asunto, cuerpo } = req.body;
  if (!destinatario || !asunto || !cuerpo) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    await enviarCorreo(destinatario, asunto, cuerpo);
    res.status(200).json({ message: 'Correo electrónico enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo electrónico:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
