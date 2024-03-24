const express = require('express');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const client = mqtt.connect('mqtt://broker.emqx.io');
require('dotenv').config();
const cors = require('cors');


const usuarioRoutes = require('./src/routes/Usuarios');
const faqRoutes = require('./src/routes/FAQ');
const contactoRoutes = require('./src/routes/Contactos');
const productoRoutes = require('./src/routes/Productos');
const politicaRoutes = require('./src/routes/Politicas');
const dispositivoRoutes = require('./src/routes/Dispositivos');
const sesionesRoutes = require('./src/routes/Sesiones_limpieza');

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
app.use(cors()); // Usa CORS en todas las rutas

// Rutas
app.use('/api', usuarioRoutes);
app.use('/api', faqRoutes);
app.use('/api', contactoRoutes);
app.use('/api', productoRoutes);
app.use('/api', politicaRoutes);
app.use('/api', dispositivoRoutes);

app.use('/api', sesionesRoutes);
app.get('/', (req, res) => {
  res.json({ "response": "esto es mi primer servidor" });
});

// Manejador de eventos para cuando el cliente se conecta
client.on('connect', function () {
  console.log('Conexión exitosa al broker MQTT');
});

// Función para enviar correo electrónico
const enviarCorreo = async (destinatario, token) => {
  try {
    // Opciones del correo
    const body = `
  <div style="font-family: Arial, sans-serif; color: #043464; background-color: #ECF0F1; padding: 20px; border-radius: 10px;">
    <h2 style="color: #043464; font-weight: bold; font-size: 24px;">Recuperación de contraseña</h2>
    <p style="font-size: 16px;">Hola ${destinatario},</p>
    <p style="font-size: 16px;">Has solicitado restablecer tu contraseña. Por favor, utiliza el siguiente token:</p>
    <p style="background-color: #043464; color: #ECF0F1; padding: 10px; border-radius: 5px; font-weight: bold; font-size: 20px;">${token}</p>
    <p style="font-size: 16px;">Si no solicitaste este cambio, puedes ignorar este correo. Sin embargo, te recomendamos que asegures la seguridad de tu cuenta.</p>
    <p style="font-size: 16px;">Por favor, ten en cuenta que este token es válido por un tiempo limitado. Si no lo utilizas dentro de dicho período, deberás generar uno nuevo.</p>
    <p style="font-weight: bold; font-size: 16px;">Atentamente,</p>
    <p style="font-weight: bold; font-size: 16px;">Tu equipo de soporte</p>
  </div>
`;


    const mailOptions = {
      from: "20221016@uthh.edu.mx",
      to: destinatario,
      subject: 'Recuperación de contraseña',
      html: body
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
    const { destinatario, token } = req.body;

    if (!destinatario || !token) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
    }

    // Enviar correo electrónico
    await enviarCorreo(destinatario, token);
    res.status(200).json({ message: 'Correo electrónico enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar correo electrónico:', error);
    res.status(500).json({ error: 'Error interno del servidor', error });
  }
});

// Ruta para publicar un mensaje en el tópico MQTT
app.post('/publicarmensaje', function (req, res) {
  const { topico, mensaje } = req.body;

  if (!topico || !mensaje) {
      return res.status(400).json({ error: 'Faltan datos requeridos' });
  }

  // Publica un mensaje en el tópico especificado
  client.publish(topico, mensaje);
  console.log('Mensaje publicado en el tópico', topico);

  res.status(200).json({ message: 'Mensaje publicado correctamente' });
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