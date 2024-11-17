const express = require('express');
const db = require('../db');  // Importar la conexión a la base de datos

const router = express.Router();

// Ruta para crear un nuevo Tag
router.post('/create', (req, res) => {
    const { nombre } = req.body;  // Recibimos el nombre del tag desde el cuerpo de la solicitud

    // Validar que el nombre no esté vacío
    if (!nombre) {
        return res.status(400).json({ error: 'El nombre del tag es obligatorio' });
    }

    // Insertar el nuevo tag en la base de datos
    const query = 'INSERT INTO Tag (nombre) VALUES (?)';
    db.query(query, [nombre], (err, results) => {
        if (err) {
            console.error('Error al crear el tag:', err);
            return res.status(500).json({
                error: 'Error al crear el tag',
                details: err
            });
        }

        // Si la inserción fue exitosa, respondemos con el ID del nuevo tag
        res.status(201).json({
            success: true,
            id: results.insertId,
            nombre: nombre
        });
    });
});

module.exports = router;
