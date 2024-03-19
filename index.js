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

// Configuración del transporte SMTP
const transporter = nodemailer.createTransport({
  host: 'smtp.elasticemail.com',
  port: 2525, // Puerto SMTP
  secure: false, // true para usar SSL/TLS, false para usar el puerto predeterminado
  auth: {
    user: process.env.EMAIL_USER, // Usuario SMTP
    pass: process.env.EMAIL_PASS // Contraseña SMTP
  }
});


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


app.post('/api/enviarcorreo', (req, res) => {
  const { nombre, apellido, correo, telefono, mensaje } = req.body;

  // Cuerpo del correo
  const body = `Hola ${nombre} ${apellido}, hemos recibido tu mensaje. En breve nos pondremos en contacto contigo.`;

  // Opciones del correo
  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: correo,
    subject: 'Mensaje recibido',
    text: body
  };

  // Enviar el correo
  transporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      console.error('Error al enviar el correo:', error);
      res.status(500).json({ message: 'Error al enviar el correo' });
    } else {
      console.log('Correo enviado con éxito:', info.response);
      res.status(200).json({ message: 'Correo enviado con éxito' });
    }
  });
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


