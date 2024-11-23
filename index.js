const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const usuariosRoutes = require('./routes/usuarios');
const tareasRoutes = require('./routes/tareas');
const tagsRoutes = require('./routes/tags');
const db = require('./db');  // Importa el pool de conexiones

// Cargar variables de entorno
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/usuarios', usuariosRoutes);
app.use('/tareas', tareasRoutes);
app.use('/tags', tagsRoutes);

// Prueba de conexión
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
    console.log(`Servidor ejecutándose en http://0.0.0.0:${PORT}`);
});
