const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear tarea
router.post('/tareas', (req, res) => {
    const { usuario_id, actividad_id, tag_id, descripcion, fecha } = req.body;

    if (!usuario_id || !actividad_id || !descripcion || !fecha) {
        return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes.' });
    }

    const query = 'INSERT INTO Tarea (usuario_id, actividad_id, tag_id, descripcion, fecha) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [usuario_id, actividad_id, tag_id || null, descripcion, fecha], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al crear la tarea', details: err });
        } else {
            res.json({ success: true, id: result.insertId });
        }
    });
});

// Listar todas las tareas
router.get('/tareas', (req, res) => {
    const query = 'SELECT * FROM Tarea';
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al listar las tareas', details: err });
        } else {
            res.json({ success: true, tasks: results });
        }
    });
});

// Listar tareas por usuario
router.get('/tareas/user/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Tarea WHERE usuario_id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al listar las tareas', details: err });
        } else {
            res.json({ success: true, tasks: results });
        }
    });
});

// Obtener tarea por ID
router.get('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Tarea WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al obtener la tarea', details: err });
        } else if (results.length === 0) {
            res.status(404).json({ error: 'Tarea no encontrada' });
        } else {
            res.json({ success: true, task: results[0] });
        }
    });
});

// Editar tarea
router.put('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const { actividad_id, tag_id, descripcion, fecha } = req.body;

    if (!actividad_id || !descripcion || !fecha) {
        return res.status(400).json({ error: 'Todos los campos obligatorios deben estar presentes.' });
    }

    const query = 'UPDATE Tarea SET actividad_id = ?, tag_id = ?, descripcion = ?, fecha = ? WHERE id = ?';
    db.query(query, [actividad_id, tag_id || null, descripcion, fecha, id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al editar la tarea', details: err });
        } else {
            res.json({ success: true });
        }
    });
});

// Eliminar tarea
router.delete('/tareas/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Tarea WHERE id = ?';
    db.query(query, [id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al eliminar la tarea', details: err });
        } else {
            res.json({ success: true });
        }
    });
});

module.exports = router;
