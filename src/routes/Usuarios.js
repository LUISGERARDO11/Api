const express = require('express');
const esquema = require('../models/Usuarios');
const router = express.Router();

// Crear un usuario
router.post('/usuarios', async (req, res) => {
    try {
        const nuevoUsuario = await esquema.create(req.body);
        res.json(nuevoUsuario);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Leer todos los usuarios
router.get('/usuarios', async (req, res) => {
    try {
        const usuarios = await esquema.find();
        res.json(usuarios);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar usuario por ID
router.get('/usuarios/:id', async (req, res) => {
    try {
        const usuario = await esquema.findById(req.params.id);
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'No se encontró ningún usuario con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Buscar usuario por email
router.get('/usuarios/email/:email', async (req, res) => {
    try {
        const usuario = await esquema.findOne({ email: req.params.email });
        if (usuario) {
            res.json(usuario);
        } else {
            res.status(404).json({ message: 'No se encontró ningún usuario con el correo electrónico proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// Iniciar sesión
router.post('/usuarios/login', async (req, res) => {
    try {
        const { correo, contrasenia } = req.body;
        const usuario = await esquema.findOne({ correo, contrasenia });
        if (usuario) {
            res.json({ success: true, accessToken: generateAccessToken(usuario) });
        } else {
            res.status(404).json({ success: false, message: 'Correo electrónico o contraseña incorrectos' });
        }
    } catch (error) {
        res.status(500).json({ success: false, message: 'Error al buscar usuario', error });
    }
});

// Eliminar usuario por ID
router.delete('/usuarios/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const usuarioEliminado = await esquema.findByIdAndDelete(id);
        if (usuarioEliminado) {
            res.json({ message: 'Usuario eliminado correctamente', usuarioEliminado });
        } else {
            res.status(404).json({ message: 'No se encontró ningún usuario con el ID proporcionado' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Error al eliminar usuario', error });
    }
});

module.exports = router;
