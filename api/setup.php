<?php
// setup.php

include 'db.php';

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
}

// Obtener la contraseña del archivo .env
$adminPassword = isset($_ENV['ADMIN_PASSWORD']) ? $_ENV['ADMIN_PASSWORD'] : 'default_password';


// Datos del usuario administrador
$adminEmail = 'admin@mercadoagro.cl';
$adminUsername = 'admin';
$adminFirstname = 'Admin';
$adminLastname = 'MercadoAgro';

try {
    // Eliminar todos los usuarios excepto el administrador
    $deleteStmt = $conn->prepare("DELETE FROM mra_users WHERE email != :email");
    $deleteStmt->bindParam(':email', $adminEmail);
    $deleteStmt->execute();

    // Verificar si el usuario ya existe
    $stmt = $conn->prepare("SELECT * FROM mra_users WHERE email = :email");
    $stmt->bindParam(':email', $adminEmail);
    $stmt->execute();
    $user = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($user) {
        // Actualizar la contraseña del usuario si ya existe
        $hashedPassword = password_hash($adminPassword, PASSWORD_BCRYPT);
        $updateStmt = $conn->prepare("UPDATE mra_users SET password = :password WHERE email = :email");
        $updateStmt->bindParam(':password', $hashedPassword);
        $updateStmt->bindParam(':email', $adminEmail);
        $updateStmt->execute();
        echo json_encode(["success" => true, "message" => "Usuario actualizado exitosamente"]);
    } else {
        // Insertar un nuevo usuario si no existe
        $hashedPassword = password_hash($adminPassword, PASSWORD_BCRYPT);
        $insertStmt = $conn->prepare("INSERT INTO mra_users (username, firstname, lastname, email, password) VALUES (:username, :firstname, :lastname, :email, :password)");
        $insertStmt->bindParam(':username', $adminUsername);
        $insertStmt->bindParam(':firstname', $adminFirstname);
        $insertStmt->bindParam(':lastname', $adminLastname);
        $insertStmt->bindParam(':email', $adminEmail);
        $insertStmt->bindParam(':password', $hashedPassword);
        $insertStmt->execute();
        echo json_encode(["success" => true, "message" => "Usuario creado exitosamente"]);
    }
} catch (PDOException $e) {
    echo json_encode(["success" => false, "message" => "Error: " . $e->getMessage()]);
}
?>