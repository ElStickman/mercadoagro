<?php
// db.php

// Cargar variables del archivo .env
if (file_exists(__DIR__ . '/.env')) {
    $lines = file(__DIR__ . '/.env');
    foreach ($lines as $line) {
        // Omitir líneas en blanco y comentarios
        if (strpos(trim($line), '#') === 0 || trim($line) === '') {
            continue;
        }

        // Separar el nombre y el valor de la variable
        list($name, $value) = explode('=', trim($line), 2);

        // Eliminar espacios en blanco alrededor del nombre y valor
        $name = trim($name);
        $value = trim($value);

        // Establecer la variable en $_ENV
        $_ENV[$name] = $value;
    }
} else {
    echo "Archivo .env no encontrado.";
    die();
}

$servername = $_ENV['REACT_SERVER'] ?? 'localhost';
$username = $_ENV['REACT_DB_USER'] ?? 'default_user';
$password = $_ENV['REACT_DB_PASSWORD'] ?? 'default_password';
$database = $_ENV['REACT_DB_DBNAME'] ?? 'default_dbname';

try {
    // Crear una nueva conexión a la base de datos
    $conn = new PDO("mysql:host=$servername;dbname=$database", $username, $password);
    // Configurar PDO para que lance excepciones en caso de errores
    $conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
} catch (PDOException $e) {
    echo "Connection failed: " . $e->getMessage();
    die();
}
?>
