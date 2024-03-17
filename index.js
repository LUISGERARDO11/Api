const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
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
app.use(express.urlencoded({ extended: true }));

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
mongoose.connect(process.env.MONGO_URI, { dbName: 'smarthomesweepers', useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('Conectado a MongoDB');
    app.listen(port, () => {
      console.log('Corriendo en el puerto ' + port);
    });
  })
  .catch(error => {
    console.error('Error al conectar a MongoDB:', error);
    process.exit(1); // Detener la ejecución de la aplicación en caso de error
  });

// Función para enviar correo electrónico
const enviarCorreo = async (destinatario, asunto, cuerpo) => {
  try {
    // Configurar el transporte de correo
    const transporter = nodemailer.createTransport({
      host: 'smtp.elasticemail.com',
      port: 2525, // Puerto SMTP de Elastic Email
      secure: false, // true para SSL, false para TLS
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
      }
    });

    // Opciones del correo
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: destinatario,
      subject: asunto,
      text: cuerpo
    };

    // Enviar el correo electrónico
    await transporter.sendMail(mailOptions);
    console.log('Correo electrónico enviado con éxito a', destinatario);
  } catch (error) {
    console.error('Error al enviar correo electrónico:', error);
    throw error;
  }
};

// Endpoint para enviar correo electrónico
app.post('/enviarcorreo', async (req, res) => {
  const { destinatario, asunto, cuerpo } = req.body;

  if (!destinatario || !asunto || !cuerpo) {
    return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  try {
    // Enviar correo electrónico
    await enviarCorreo(destinatario, asunto, cuerpo);
    res.status(200).json({ message: 'Correo electrónico enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo electrónico:', error);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
});
