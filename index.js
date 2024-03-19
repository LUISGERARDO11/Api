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

// Configuración del transporte SMTP para Gmail
const transporter = nodemailer.createTransport({
  host: 'smtp.gmail.com',
  port: 587, // Puerto SMTP de Gmail
  secure: false, // true para usar SSL/TLS, false para usar el puerto predeterminado
  auth: {
    user: "20221016@uthh.edu.mx",
    pass: "eogo ihfl xqvz tatl"
  },
  tls: {
    rejectUnauthorized: false // Habilitar cuando estás trabajando con un entorno de producción seguro
  }
})

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

// Función para enviar correo electrónico
const enviarCorreo = async (destinatario, asunto, cuerpo) => {
  try {
    // Opciones del correo
    const mailOptions = {
      from: "20221016@uthh.edu.mx",
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
  try {
    const { destinatario, asunto, cuerpo } = req.body;

    if (!destinatario || !asunto || !cuerpo) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Enviar correo electrónico
    await enviarCorreo(destinatario, asunto, cuerpo);
    res.status(200).json({ message: 'Correo electrónico enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo electrónico:', error);
    res.status(500).json({ error: 'Error interno del servidor', error });
  }
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
