const mysql = require('mysql2');
require('dotenv').config();  // Cargar configuración de dotenv
const bcrypt = require('bcrypt');  // Importa bcrypt para encriptar contraseñas

// Configuración de la conexión a la base de datos
const connection = mysql.createConnection({
  host: process.env.REACT_DB_HOST || 'localhost',
  user: process.env.REACT_DB_USER,
  password: process.env.REACT_DB_PASSWORD,
  database: process.env.REACT_DB_DBNAME,
});

// Capturar la opción '--clean' desde los argumentos de línea de comando
const isClean = process.argv.includes('--clean');

// Función genérica para ejecutar una consulta
function executeQuery(query, successMessage) {
  return new Promise((resolve, reject) => {
    connection.query(query, (err) => {
      if (err) {
        console.error(`Error al ejecutar la consulta: ${err}`);
        reject(err);
      } else {
        console.log(successMessage);
        resolve();
      }
    });
  });
}

// Función para borrar una tabla
function dropTable(tableName) {
  const query = `DROP TABLE IF EXISTS ${tableName}`;
  return executeQuery(query, `Tabla ${tableName} borrada.`);
}

// Función para crear la tabla de usuarios
function createUsersTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS mra_users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      confirmed TINYINT(1) DEFAULT 0,
      policyagreed TINYINT(1) DEFAULT 0,
      firstname VARCHAR(255) NOT NULL,
      lastname VARCHAR(255) NOT NULL,
      username VARCHAR(255) NOT NULL UNIQUE,
      email VARCHAR(255) NOT NULL UNIQUE,
      phone VARCHAR(20) NULL,
      address VARCHAR(255) NULL,
      city VARCHAR(255) NULL,
      lang VARCHAR(10) DEFAULT 'es',
      firstaccess INT NULL,
      lastlogin INT NULL,
      url VARCHAR(255) NULL,
      description TEXT NULL,
      password VARCHAR(255) NOT NULL,
      timecreated INT NOT NULL,
      timemodified INT NOT NULL,
      idnumber VARCHAR(20),
      suspended TINYINT(1) DEFAULT 0,
      deleted TINYINT(1) DEFAULT 0
    );
  `;
  return executeQuery(query, 'Tabla de usuarios creada o ya existe.');
}

// Función para crear la tabla de categorías
function createCategoryTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS mra_category (
      id INT AUTO_INCREMENT PRIMARY KEY,
      name VARCHAR(255) NOT NULL,
      shortname VARCHAR(255),
      description TEXT,
      parent INT,
      mainparent INT,
      path VARCHAR(255),
      visible TINYINT(1) DEFAULT 1,
      timecreated INT NOT NULL,
      timemodified INT NOT NULL
    );
  `;
  return executeQuery(query, 'Tabla de categorías creada o ya existe.');
}

// Función para crear la tabla de productos de usuarios
// type 1 = producto type 2 = servicio
function createUserProductsTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS mra_user_products (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userrelated INT NOT NULL,
      categoryid INT,
      name VARCHAR(255) NOT NULL,
      secid INT,
      description TEXT,
      type TINYINT(1) NOT NULL,
      price INT,
      quantity INT,
      photos JSON,
      deliverytype VARCHAR(255),
      score INT,
      visible TINYINT(1) DEFAULT 1,
      timecreated INT NOT NULL,
      timemodified INT NOT NULL
    );
  `;
  return executeQuery(query, 'Tabla de productos de usuarios creada o ya existe.');
}

// Función para crear la tabla de actividad de contactos
function createContactActivityTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS mra_contact_activity (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userid_request INT NOT NULL,
      userid_requested INT NOT NULL,
      timecreated INT NOT NULL,
      timemodified INT NOT NULL,
      notification_seen TINYINT(1) DEFAULT 0
    );
  `;
  return executeQuery(query, 'Tabla de actividad de contactos creada o ya existe.');
}

// Función para crear la tabla de registros (logs)
function createLogTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS mra_log_mercadoagro (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userid INT NOT NULL,
      relateduserid INT,
      component VARCHAR(255),
      action VARCHAR(255),
      target VARCHAR(255),
      crud VARCHAR(10),
      context VARCHAR(255),
      origin VARCHAR(255),
      ip VARCHAR(50),
      other TEXT,
      timecreated INT NOT NULL
    );
  `;
  return executeQuery(query, 'Tabla de logs creada o ya existe.');
}

// Función para crear la tabla de administradores
function createAdminListTable() {
  const query = `
    CREATE TABLE IF NOT EXISTS mra_adminlist (
      id INT AUTO_INCREMENT PRIMARY KEY,
      userid INT NOT NULL,
      timecreated INT NOT NULL
    );
  `;
  return executeQuery(query, 'Tabla de administradores creada o ya existe.');
}

// Función principal para crear todas las tablas sin cerrar la conexión
async function createAllTables() {
  try {
    if (isClean) {
      await dropTable('mra_adminlist');
      await dropTable('mra_log_mercadoagro');
      await dropTable('mra_contact_activity');
      await dropTable('mra_user_products');
      await dropTable('mra_category');
      await dropTable('mra_users');
      console.log('Todas las tablas han sido borradas.');
    }

    // Crear las tablas
    await createUsersTable();
    await createCategoryTable();
    await createUserProductsTable();
    await createContactActivityTable();
    await createLogTable();
    await createAdminListTable();
    console.log('Todas las tablas han sido creadas o ya existen.');
  } catch (error) {
    console.error('Error al crear las tablas:', error);
  }
}

// Función para insertar un usuario por defecto y agregarlo a la lista de administradores
async function insertDefaultUser() {
  try {
    // Encriptar la contraseña por defecto
    const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);

    // Consulta para insertar el usuario en mra_users
    const userQuery = `
      INSERT INTO mra_users (
        id, confirmed, policyagreed, firstname, lastname, username, email, phone, address, city, lang, firstaccess, lastlogin, url, description, password, timecreated, timemodified, idnumber, suspended, deleted
      ) VALUES (
        1, 1, 1, 'Alejandro', 'Donoso', 'aledonoso', 'alejandro-donoso@hotmail.com', NULL, NULL, NULL, 'es', NULL, NULL, NULL, NULL, '${hashedPassword}', UNIX_TIMESTAMP(), UNIX_TIMESTAMP(), '190751309', 0, 0
      )
      ON DUPLICATE KEY UPDATE id=id;
    `;

    // Consulta para insertar al usuario como administrador en mra_adminlist
    const adminQuery = `
      INSERT INTO mra_adminlist (
        userid, timecreated
      ) VALUES (
        1, UNIX_TIMESTAMP()
      )
      ON DUPLICATE KEY UPDATE userid=userid;
    `;

    // Ejecutar ambas consultas
    await executeQuery(userQuery, 'Usuario por defecto insertado o ya existente.');
    await executeQuery(adminQuery, 'Usuario agregado como administrador.');

  } catch (error) {
    console.error('Error al encriptar la contraseña o insertar el usuario como administrador:', error);
  }
}

// Ejecutar todas las operaciones principales en una función asíncrona
(async () => {
  await createAllTables();  // Llamada para crear todas las tablas

  // Ejecutar la inserción del usuario por defecto después de crear las tablas
  await insertDefaultUser();

  // Cerrar la conexión después de que todas las operaciones hayan terminado
  connection.end((err) => {
    if (err) console.error('Error al cerrar la conexión:', err);
    else console.log('Conexión cerrada correctamente.');
  });
})();

