const express = require('express');
const router = express.Router();
const db = require('../db');

// Registro de usuario
router.post('/register', (req, res) => {
    const { nombre, apellido, username, password, rol_id } = req.body;
    const query = 'INSERT INTO Usuario (nombre, apellido, username, password, rol_id) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [nombre, apellido, username, password, rol_id], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al registrar el usuario', details: err });
        } else {
            res.json({ success: true, id: result.insertId });
        }
    });
});

// Login de usuario
router.post('/login', (req, res) => {
    const { username, password } = req.body;
    const query = 'SELECT * FROM Usuario WHERE username = ? AND password = ?';
    db.query(query, [username, password], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al realizar el login', details: err });
        } else if (results.length === 0) {
            res.status(401).json({ success: false, message: 'Credenciales incorrectas' });
        } else {
            res.json({ success: true, user: results[0] });
        }
    });
});

module.exports = router;
