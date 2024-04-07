const express = require('express');
const mqtt = require('mqtt'); 
const DispositivoModel = require('../models/Dispositivos'); // Importa el modelo Dispositivo si está definido en otro archivo



const router = express.Router();


// Conexión al servidor MQTT

// Credenciales de acceso a HiveMQ
const username = 'hivemq.webclient.1711220869556';
const password = 'B37H,C@fm&:PtFi8Uc9d"';

// Configuración del cliente MQTT con las credenciales de acceso
const mqttClient = mqtt.connect('mqtt://broker.hivemq.com', {
  username: username,
  password: password
});

// Obtener todos los dispositivos
router.get('/dispositivo', async (req, res) => {
  try {
    const dispositivos = await DispositivoModel.find();
    res.json(dispositivos);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo dispositivos' });
  }
});

// Obtener un dispositivo específico por _id
router.get('/dispositivo/:id', async (req, res) => {
  const id = req.params.id;
  try {
    const dispositivo = await DispositivoModel.findById(id);
    if (!dispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json(dispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo dispositivo' });
  }
});

// Saber si un dispositivo exoste por su clave
router.get('/dispositivo/clave/:clave', async (req, res) => {
  const clave = req.params.clave;

  try {
    // Buscar el dispositivo por su clave
    const dispositivo = await DispositivoModel.findOne({ clave });

    if (!dispositivo) {
      return res.json({ exists: false, message: 'Dispositivo no encontrado' });
    }

    res.json({ exists: true, dispositivo });
  } catch (error) {
    res.status(500).json({ message: 'Error obteniendo dispositivo por clave', error: error.message });
  }
});


// Agregar un nuevo dispositivo
router.post('/dispositivo', async (req, res) => {
  const { clave, nombre, estado, usuario_id, temperatura, humedad } = req.body;

  if (!clave || !nombre || !estado || !usuario_id || !temperatura || !humedad) {
    return res.status(400).json({ message: 'Por favor, proporcione clave, nombre, estado, usuario_id, temperatura y humedad' });
  }

  const newDispositivo = new DispositivoModel({ clave, nombre, estado, usuario_id, temperatura, humedad });

  try {
    const savedDispositivo = await newDispositivo.save();
    res.status(201).json(savedDispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error creando dispositivo' });
  }
});


// Actualizar un dispositivo específico por _id
router.put('/dispositivo/:id', async (req, res) => {
  const { id } = req.params;
  const { clave, nombre, estado, usuario_id, temperatura, humedad } = req.body;

  if (!clave || !nombre || !estado || !usuario_id || !temperatura || !humedad) {
    return res.status(400).json({ message: 'Por favor, proporcione clave, nombre, estado, usuario_id, temperatura y humedad' });
  }

  const update = { clave, nombre, estado, usuario_id, temperatura, humedad };

  try {
    const updatedDispositivo = await DispositivoModel.findByIdAndUpdate(id, update, { new: true });
    if (!updatedDispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json(updatedDispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando dispositivo' });
  }
});

// Eliminar un dispositivo específico por _id
router.delete('/dispositivo/:id', async (req, res) => {
  const { id } = req.params;

  try {
    const deletedDispositivo = await DispositivoModel.findByIdAndDelete(id);
    if (!deletedDispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }
    res.json({ message: 'Dispositivo eliminado' });
  } catch (error) {
    res.status(500).json({ message: 'Error eliminando dispositivo' });
  }
});

// Método POST para actualizar el estado de un dispositivo por su _id
router.post('/control/actualizarestado', async (req, res) => {
  const { id, estado } = req.body;

  if (!id || !estado) {
    return res.status(400).json({ message: 'Por favor, proporcione el ID y el nuevo estado del dispositivo' });
  }

  try {
    // Actualizar solo el estado del dispositivo por su _id
    const updatedDispositivo = await DispositivoModel.findByIdAndUpdate(id, { estado }, { new: true });
    
    if (!updatedDispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }

    res.json(updatedDispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando estado del dispositivo' });
  }
});

// Método POST para actualizar la temperatura y humedad de un dispositivo por su campo 'clave'
router.post('/control/actualizartemperaturahumedad', async (req, res) => {
  const { clave, temperatura, humedad } = req.body;

  if (!clave || !temperatura || !humedad) {
    return res.status(400).json({ message: 'Por favor, proporcione la clave, temperatura y humedad del dispositivo' });
  }

  try {
    // Actualizar la temperatura y humedad del dispositivo por su campo 'clave'
    const updatedDispositivo = await DispositivoModel.findOneAndUpdate({ clave }, { temperatura, humedad }, { new: true });
    
    if (!updatedDispositivo) {
      return res.status(404).json({ message: 'Dispositivo no encontrado' });
    }

    res.json(updatedDispositivo);
  } catch (error) {
    res.status(500).json({ message: 'Error actualizando temperatura y humedad del dispositivo' });
  }
});


//Controlar el dispositivo
router.post('/control/enviarmensaje', (req, res) => {
  const { mensaje } = req.body;

  if (!mensaje) {
    return res.status(400).json({ message: 'Por favor, proporciona un mensaje' });
  }

  // Verificar la conexión MQTT
  if (!mqttClient.connected) {
    return res.status(500).json({ message: 'Error: Conexión MQTT no disponible' });
  }

  // Publicar el mensaje en el tema "control-led"
  mqttClient.publish('control-led', mensaje, (error) => {
    if (error) {
      console.error('Error al enviar mensaje MQTT:', error);
      return res.status(500).json({ message: 'Error al enviar mensaje MQTT' });
    }
    console.log('Mensaje MQTT enviado con éxito:', mensaje);
    res.status(200).json({ message: 'Mensaje MQTT enviado con éxito' });
  });
});


module.exports = router;
