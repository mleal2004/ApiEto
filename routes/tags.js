const express = require('express');
const db = require('../db');  // Importar la conexión a la base de datos

const router = express.Router();

// Obtener todos los tags
router.get('/tags', (req, res) => {
    console.log("Se realiza consulta de tags");
    const query = 'SELECT * FROM Tag';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los tags:', err);
            return res.status(500).json({ error: 'Error al obtener los tags' });
        }
        res.status(200).json({ success: true, tags: results });
    });
});

// Obtener un tag por ID
router.get('/tags/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Tag WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el tag:', err);
            return res.status(500).json({ error: 'Error al obtener el tag' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Tag no encontrado' });
        }
        res.status(200).json({ success: true, tag: results[0] });
    });
});

// Actualizar un tag por ID
router.put('/tags/:id', (req, res) => {
    const { id } = req.params;
    const { nombre } = req.body;

    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del tag es obligatorio' });
    }

    const query = 'UPDATE Tag SET nombre = ? WHERE id = ?';
    db.query(query, [nombre, id], (err, results) => {
        if (err) {
            console.error('Error al actualizar el tag:', err);
            return res.status(500).json({ error: 'Error al actualizar el tag' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Tag no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Tag actualizado' });
    });
});

// Eliminar un tag por ID
router.delete('/tags/:id', (req, res) => {
    const { id } = req.params;
    const query = 'DELETE FROM Tag WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al eliminar el tag:', err);
            return res.status(500).json({ error: 'Error al eliminar el tag' });
        }
        if (results.affectedRows === 0) {
            return res.status(404).json({ error: 'Tag no encontrado' });
        }
        res.status(200).json({ success: true, message: 'Tag eliminado' });
    });
});


module.exports = router;
