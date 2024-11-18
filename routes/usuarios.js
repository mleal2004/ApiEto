const express = require('express');
const router = express.Router();
const db = require('../db');
const bcrypt = require('bcrypt'); // Para manejar contraseñas de forma segura

// Crear un nuevo usuario
router.post('/usuarios', async (req, res) => {
    const { nombre, apellido, username, password, rol_id } = req.body;

    // Validar los datos de entrada
    if (!nombre || !apellido || !username || !password || !rol_id) {
        return res.status(400).json({ error: 'Todos los campos son obligatorios' });
    }

    try {
        // Encriptar la contraseña antes de almacenarla
        const hashedPassword = await bcrypt.hash(password, 10);
        const query = 'INSERT INTO Usuario (nombre, apellido, username, password, rol_id) VALUES (?, ?, ?, ?, ?)';
        db.query(query, [nombre, apellido, username, hashedPassword, rol_id], (err, result) => {
            if (err) {
                if (err.code === 'ER_DUP_ENTRY') {
                    return res.status(400).json({ error: 'El nombre de usuario ya está en uso' });
                }
                return res.status(500).json({ error: 'Error al crear el usuario', details: err });
            }
            res.status(201).json({ success: true, id: result.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al procesar la contraseña', details: err });
    }
});

// Listar todos los usuarios
router.get('/usuarios', (req, res) => {
    const query = 'SELECT id, nombre, apellido, username, rol_id, createdAt FROM Usuario';
    db.query(query, (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al listar los usuarios', details: err });
        }
        res.status(200).json({ success: true, users: results });
    });
});

// Obtener un usuario por ID
router.get('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT id, nombre, apellido, username, rol_id, createdAt FROM Usuario WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al obtener el usuario', details: err });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }
        res.status(200).json({ success: true, user: results[0] });
    });
});

// Actualizar un usuario
router.put('/usuarios/:id', async (req, res) => {
    const { id } = req.params;
    const { nombre, apellido, username, password, rol_id } = req.body;

    // Validar los datos de entrada
    if (!nombre || !apellido || !username || !rol_id) {
        return res.status(400).json({ error: 'Todos los campos excepto la contraseña son obligatorios' });
    }

    try {
        let query;
        let params;

        if (password) {
            // Si se envía una nueva contraseña, encriptarla y actualizarla
            const hashedPassword = await bcrypt.hash(password, 10);
            query = 'UPDATE Usuario SET nombre = ?, apellido = ?, username = ?, password = ?, rol_id = ? WHERE id = ?';
            params = [nombre, apellido, username, hashedPassword, rol_id, id];
        } else {
            query = 'UPDATE Usuario SET nombre = ?, apellido = ?, username = ?, rol_id = ? WHERE id = ?';
            params = [nombre, apellido, username, rol_id, id];
        }

        db.query(query, params, (err, result) => {
            if (err) {
                return res.status(500).json({ error: 'Error al actualizar el usuario', details: err });
            }
            res.status(200).json({ success: true });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al procesar la contraseña', details: err });
    }
});

// Eliminar un usuario
router.delete('/usuarios/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Usuario WHERE id = ?';
    db.query(query, [id], (err, result) => {
        if (err) {
            return res.status(500).json({ error: 'Error al eliminar el usuario', details: err });
        }
        res.status(200).json({ success: true });
    });
});

module.exports = router;
