const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear tarea
router.post('/create', (req, res) => {
    const { usuario_id, actividad_id, tag_id, descripcion, fecha } = req.body;
    const query = 'INSERT INTO Tarea (usuario_id, actividad_id, tag_id, descripcion, fecha) VALUES (?, ?, ?, ?, ?)';
    db.query(query, [usuario_id, actividad_id, tag_id, descripcion, fecha], (err, result) => {
        if (err) {
            res.status(500).json({ error: 'Error al crear la tarea', details: err });
        } else {
            res.json({ success: true, id: result.insertId });
        }
    });
});

// Listar tareas por usuario
router.get('/user/:id', (req, res) => {
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

// Editar tarea
router.put('/:id', (req, res) => {
    const { id } = req.params;
    const { actividad_id, tag_id, descripcion, fecha } = req.body;
    const query = 'UPDATE Tarea SET actividad_id = ?, tag_id = ?, descripcion = ?, fecha = ? WHERE id = ?';
    db.query(query, [actividad_id, tag_id, descripcion, fecha, id], (err) => {
        if (err) {
            res.status(500).json({ error: 'Error al editar la tarea', details: err });
        } else {
            res.json({ success: true });
        }
    });
});

// Eliminar tarea
router.delete('/:id', (req, res) => {
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
