const mysql = require('mysql2');
const dotenv = require('dotenv');

dotenv.config(); // Cargar las variables de entorno

// Crear el pool de conexiones
const pool = mysql.createPool({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 5,  // El número máximo de conexiones simultáneas
    queueLimit: 0         // El número de conexiones en espera (0 significa sin límite)
});

// Proveer un método para obtener una conexión desde el pool
const getConnection = () => {
    return new Promise((resolve, reject) => {
        pool.getConnection((err, connection) => {
            if (err) {
                console.error('Error al obtener la conexión:', err);
                reject(err);
            } else {
                resolve(connection);
            }
        });
    });
};

// Función para verificar la conexión
const checkConnection = async () => {
    try {
        const connection = await getConnection();
        console.log('Conexión a la base de datos está activa');
        connection.release(); // Liberar la conexión después de usarla
    } catch (err) {
        console.log('Conexión a la base de datos no está activa, intentando reconectar...');
        // Aquí puedes realizar un manejo adecuado de reconexión si lo deseas.
    }
};

// Validar la conexión cada segundo
setInterval(() => {
    checkConnection();
}, 1000); // Validar cada segundo (1000 ms)

// Exportar el pool para ser utilizado en otros archivos
module.exports = pool;
