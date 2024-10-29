const mysql = require('mysql2');
require('dotenv').config();
const connection = mysql.createConnection({
  host: 'localhost',
  user: process.env.REACT_DB_USER,
  password: process.env.REACT_DB_PASSWORD,
  database: process.env.REACT_DB_DBNAME
});

connection.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos:', err);
    return;
  }
  console.log('Conectado a la base de datos MySQL');
});

module.exports = connection;
