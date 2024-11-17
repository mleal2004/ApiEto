const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Cargar las variables de entorno

// Conexión a la base de datos
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos:', err);
        process.exit(1);
    }
    console.log('Conectado a MySQL');
});

module.exports = db; // Exporta la conexión para usarla en otros archivos
