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
                return res.status(500).json({ error: 'Error al crear el usuario', details: err.message });
            }
            res.status(201).json({ success: true, id: result.insertId });
        });
    } catch (err) {
        res.status(500).json({ error: 'Error al procesar la contraseña', details: err.message });
    }
});

// Listar todos los usuarios
router.get('/usuarios', (req, res) => {
    console.log("Se realiza consulta de usuarios");
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
                return res.status(500).json({ error: 'Error al actualizar el usuario', details: err.message });
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

// Login de usuario
router.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validar los datos de entrada
    if (!username || !password) {
        return res.status(400).json({ error: 'El nombre de usuario y la contraseña son obligatorios' });
    }

    const query = 'SELECT id, username, password, rol_id FROM Usuario WHERE username = ?';
    db.query(query, [username], async (err, results) => {
        if (err) {
            return res.status(500).json({ error: 'Error al buscar el usuario', details: err });
        }

        if (results.length === 0) {
            return res.status(404).json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];

        try {
            // Comparar la contraseña proporcionada con la almacenada en la base de datos
            const isMatch = await bcrypt.compare(password, user.password);

            if (!isMatch) {
                return res.status(401).json({ error: 'Contraseña incorrecta' });
            }

            // Si las credenciales son válidas, puedes generar un token o devolver los datos del usuario
            res.status(200).json({
                success: true,
                message: 'Login exitoso',
                id: user.id,
                username: user.username,
                rol_id: user.rol_id
                
                
            });
        } catch (err) {
            console.error("Error en bcrypt.compare:", err);
            res.status(500).json({ error: 'Error al procesar la autenticación', details: err.message });
        }
    });
});


module.exports = router;
