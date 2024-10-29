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

// Función para insertar productos o servicios agrícolas por defecto
async function insertDefaultProducts() {
  const products = [
    { userrelated: 1, categoryid: 1, name: 'Tractor agrícola', secid: 1001, description: 'Tractor en buen estado para uso agrícola', type: 1, price: 15000, quantity: 1, photos: JSON.stringify([]), deliverytype: 'Envio a domicilio', score: 4, visible: 1, timecreated: Math.floor(Date.now() / 1000), timemodified: Math.floor(Date.now() / 1000) },
    { userrelated: 1, categoryid: 2, name: 'Servicio de fumigación', secid: 1002, description: 'Fumigación de cultivos agrícolas', type: 2, price: 200, quantity: 1, photos: JSON.stringify([]), deliverytype: 'Servicio en terreno', score: 5, visible: 1, timecreated: Math.floor(Date.now() / 1000), timemodified: Math.floor(Date.now() / 1000) },
    // Agrega más productos si es necesario
  ];

  try {
    for (const product of products) {
      const query = `
        INSERT INTO mra_user_products (
          userrelated, categoryid, name, secid, description, type, price, quantity, photos, deliverytype, score, visible, timecreated, timemodified
        ) VALUES (
          ${product.userrelated}, ${product.categoryid}, '${product.name}', ${product.secid}, '${product.description}', ${product.type}, ${product.price}, ${product.quantity}, '${product.photos}', '${product.deliverytype}', ${product.score}, ${product.visible}, ${product.timecreated}, ${product.timemodified}
        )
      `;
      await executeQuery(query, `Producto/Servicio "${product.name}" insertado.`);
    }
  } catch (error) {
    console.error('Error al insertar productos por defecto:', error);
  }
}

// Ejecutar todas las operaciones principales en una función asíncrona
(async () => {
  await insertDefaultProducts(); // Llamada para insertar los productos

  // Cerrar la conexión después de que todas las operaciones hayan terminado
  connection.end((err) => {
    if (err) console.error('Error al cerrar la conexión:', err);
    else console.log('Conexión cerrada correctamente.');
  });
})();
