require('dotenv').config();

const express = require('express');
const cors = require('cors');

const mysql = require('mysql2');
const bcrypt = require('bcrypt');  // Para encriptar la contraseña
const jwt = require('jsonwebtoken');  // JWT para autenticación


const app = express();
app.use(express.json());
app.use(cors());

// Conexión a la base de datos MariaDB
const db = mysql.createConnection({
  host: 'localhost',
  user: process.env.REACT_DB_USER,
  password: process.env.REACT_DB_PASSWORD,
  database: process.env.REACT_DB_DBNAME
});

db.connect((err) => {
  if (err) {
    console.error('Error al conectar a la base de datos MariaDB:', err);
    return;
  }
  console.log('Conectado a la base de datos MariaDB');
});

// Ruta para registrar un usuario
app.post('/register', async (req, res) => {
  const { username, email, password, firstname, lastname } = req.body;

  console.log('Datos recibidos:', { username, email, password, firstname, lastname });

  // Verificar si el usuario ya existe
  const checkUserQuery = 'SELECT * FROM mra_users WHERE email = ?';
  db.query(checkUserQuery, [email], async (err, results) => {
    if (err) {
      console.error('Error en la verificación del usuario:', err);
      return res.status(500).json({ error: 'Error al verificar el usuario' });
    }

    if (results.length > 0) {
      return res.status(400).json({ error: 'El usuario ya existe' });
    }

    try {
      // Encriptar la contraseña
      const hashedPassword = await bcrypt.hash(password, 10);

      // Obtener el timestamp actual
      const timecreated = Math.floor(Date.now() / 1000);
      const timemodified = Math.floor(Date.now() / 1000);

      // Insertar el nuevo usuario
      const insertUserQuery = 'INSERT INTO mra_users (username, email, password, firstname, lastname, timecreated, timemodified) VALUES (?, ?, ?, ?, ?, ?, ?)';
      db.query(insertUserQuery, [username, email, hashedPassword, firstname, lastname, timecreated, timemodified], (err, result) => {
        if (err) {
          console.error('Error al registrar el usuario:', err);
          return res.status(500).json({ error: 'Error al registrar el usuario' });
        }

        // Generar el token JWT para el nuevo usuario
        const userId = result.insertId;  // Obtener el ID del nuevo usuario
        const token = jwt.sign({ id: userId, username }, 'miClaveSecreta', { expiresIn: '30m' });

        // Enviar el token al frontend
        res.status(201).json({ token, message: 'Usuario registrado y autenticado exitosamente' });
      });
    } catch (err) {
      console.error('Error en el proceso de encriptación o inserción:', err);
      return res.status(500).json({ error: 'Error en el servidor' });
    }
  });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;
  
    // Verificar si el usuario existe en la base de datos
    const getUserQuery = 'SELECT * FROM mra_users WHERE email = ?';
    db.query(getUserQuery, [email], async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Error al verificar el usuario' });
      }
  
      if (results.length === 0) {
        return res.status(404).json({ error: 'Usuario no encontrado' });
      }
  
      const user = results[0];
  
      // Comparar la contraseña usando bcrypt
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ error: 'Contraseña incorrecta' });
      }
  
      // Generar el token JWT con una expiración de 30 minutos
      const token = jwt.sign({ id: user.id, username: user.username }, 'miClaveSecreta', { expiresIn: '30m' });
  
      // Enviar el token y el username al cliente
      res.json({ token, username: user.username, message: 'Inicio de sesión exitoso' });
    });
  });
  
// Ruta para obtener los productos
app.get('/api/products', (req, res) => {
  const { category, keyword } = req.query; // Obtener categoría y palabra clave desde los parámetros de consulta

  // Construir la consulta SQL base
  let query = 'SELECT * FROM mra_user_products WHERE visible = 1';
  const queryParams = [];

  // Agregar filtro de categoría si se proporciona
  if (category) {
    query += ' AND categoryid = ?';
    queryParams.push(category);
  }

  // Agregar filtro de palabra clave si se proporciona
  if (keyword) {
    // Dividir el keyword en palabras individuales para búsquedas parciales
    const words = keyword.split(' ');
    const keywordConditions = words.map(() => '(name LIKE ? OR description LIKE ?)').join(' AND ');
    query += ` AND (${keywordConditions})`;
    
    // Agregar cada palabra dos veces (una para name y otra para description)
    words.forEach(word => {
      const searchPattern = `%${word}%`;
      queryParams.push(searchPattern, searchPattern);
    });
  }

  // Ejecutar la consulta con los filtros aplicados
  db.query(query, queryParams, (err, results) => {
    if (err) {
      console.error('Error al obtener los productos:', err);
      return res.status(500).json({ error: 'Error al obtener los productos' });
    }
    res.json(results);
  });
});



// Puerto del servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
