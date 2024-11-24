const express = require('express');
const db = require('../db');  // Importar la conexión a la base de datos

const router = express.Router();

// Obtener todos las actividades
router.get('/actividades', (req, res) => {
    console.log("Se realiza consulta de actividades");
    const query = 'SELECT * FROM Actividad';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los actividades:', err);
            return res.status(500).json({ error: 'Error al obtener las actividades' });
        }
        res.status(200).json({ success: true, activities: results });
    });
});

// Obtener un actividad por ID
router.get('/actividad/:id', (req, res) => {
    const { id } = req.params;
    const query = 'SELECT * FROM Actividad WHERE id = ?';
    db.query(query, [id], (err, results) => {
        if (err) {
            console.error('Error al obtener el actividad:', err);
            return res.status(500).json({ error: 'Error al obtener la actividad' });
        }
        if (results.length === 0) {
            return res.status(404).json({ error: 'Actividad  no encontrado' });
        }
        res.status(200).json({ success: true, actividad: results[0] });
    });
});

module.exports = router;  // Asegúrate de que esta línea esté presente
