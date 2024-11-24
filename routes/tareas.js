const express = require('express');
const router = express.Router();
const db = require('../db');

// Crear tarea o actualizar si ya existe
router.post('/tareas', (req, res) => {
    console.log("Se inicia inserción de tarea");
    const { usuario_id, actividad_id, tag_id, descripcion, fecha } = req.body;
    console.log(req.body);

    // Verificar que todos los campos obligatorios estén presentes
    if (!usuario_id || !actividad_id || !descripcion || !fecha) {
        console.log("Todos los campos obligatorios deben estar presentes.");
        return res.status(400).json({ 
            success: false, 
            error: 'Todos los campos obligatorios deben estar presentes.' 
        });
    }

    // Verificar si la tarea ya existe (se puede buscar por descripción y usuario_id)
    const checkQuery = 'SELECT * FROM Tarea WHERE descripcion = ? AND usuario_id = ?';
    db.query(checkQuery, [descripcion, usuario_id], (err, result) => {
        if (err) {
            console.log("Error al verificar la tarea existente: " + err.message);
            return res.status(500).json({
                success: false,
                error: 'Error al verificar la tarea existente',
                details: err.message
            });
        }

        if (result.length > 0) {
            // Si ya existe una tarea con la misma descripción y usuario_id, actualiza la tarea
            const tareaId = result[0].id; // Suponiendo que tienes un campo 'id' en la tabla Tarea
            const updateQuery = 'UPDATE Tarea SET actividad_id = ?, tag_id = ?, fecha = ? WHERE id = ?';
            db.query(updateQuery, [actividad_id, tag_id || null, fecha, tareaId], (err, result) => {
                if (err) {
                    console.log("Error al actualizar la tarea: " + err.message);
                    return res.status(500).json({
                        success: false,
                        error: 'Error al actualizar la tarea',
                        details: err.message
                    });
                }

                // Respuesta exitosa indicando que se actualizó la tarea
                return res.json({
                    success: true,
                    message: 'Tarea actualizada correctamente',
                    id: tareaId
                });
            });
        } else {
            // Si no existe, proceder a insertar la nueva tarea
            const query = 'INSERT INTO Tarea (usuario_id, actividad_id, tag_id, descripcion, fecha) VALUES (?, ?, ?, ?, ?)';
            db.query(query, [usuario_id, actividad_id, tag_id || null, descripcion, fecha], (err, result) => {
                if (err) {
                    console.log("Error al crear la tarea: " + err.message);
                    return res.status(500).json({
                        success: false,
                        error: 'Error al crear la tarea',
                        details: err.message
                    });
                } else {
                    // Respuesta exitosa con el ID de la nueva tarea
                    return res.json({
                        success: true,
                        id: result.insertId
                    });
                }
            });
        }
    });
});



// Listar todas las tareas con sus actividades y tags asociados
router.get('/tareas', (req, res) => {
    console.log("Se realiza consulta de tareas con actividades y tags");

    // Query con INNER JOIN
    const query = `
        SELECT 
            T.id AS tarea_id,
            T.descripcion,
            T.fecha,
            A.nombre AS actividad_nombre,
            G.nombre AS tag_nombre
        FROM Tarea T
        INNER JOIN Actividad A ON T.actividad_id = A.id
        INNER JOIN Tag G ON T.tag_id = G.id
    `;

    // Ejecutar la consulta
    db.query(query, (err, results) => {
        if (err) {
            res.status(500).json({ error: 'Error al listar las tareas', details: err });
        } else {
            res.json({ success: true, tasks: results });
        }
    });
});


// Listar tareas por usuario con actividades y tags
router.get('/tareas/user/:id', (req, res) => {
    const { id } = req.params;
    console.log("Consultando tareas para el usuario con ID:", id);

    const query = `
        SELECT 
            T.id AS tarea_id,
            T.descripcion,
            T.fecha,
            A.nombre AS actividad_nombre,
            G.nombre AS tag_nombre
        FROM Tarea T
        INNER JOIN Actividad A ON T.actividad_id = A.id
        INNER JOIN Tag G ON T.tag_id = G.id
        WHERE T.usuario_id = ?
    `;

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
