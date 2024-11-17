const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const dotenv = require('dotenv');
const usuariosRoutes = require('./routes/usuarios');
const tareasRoutes = require('./routes/tareas');
const db = require('./db');  // Importa la conexión a la base de datos
const tagsRoutes = require('./routes/tags');


// Cargar variables de entorno
dotenv.config();

const app = express();  // Declaración de 'app' aquí
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/usuarios', usuariosRoutes);  // Usar rutas después de declarar 'app'
app.use('/tareas', tareasRoutes);  // Usar rutas después de declarar 'app'
app.use('/tags', tagsRoutes);  // Asegúrate de agregar esto después de definir 'app'

// Prueba de conexión
app.get('/', (req, res) => {
    res.send('API funcionando correctamente');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor ejecutándose en http://localhost:${PORT}`);
});
