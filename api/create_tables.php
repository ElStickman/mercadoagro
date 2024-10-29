<?php
// createTables.php

include 'db.php';

$cleanrestart = isset($_GET['cleanrestart']) && $_GET['cleanrestart'] == 'true';

try {
    if ($cleanrestart) {
        // Eliminar la base de datos existente y crearla de nuevo
        $conn->exec("DROP DATABASE IF EXISTS mercadoagro");
        $conn->exec("CREATE DATABASE mercadoagro DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci");
        $conn->exec("USE mercadoagro");
        echo "Base de datos eliminada y creada exitosamente.<br>";
    }

    // Crear tabla mra_users (debe crearse antes que otras tablas con claves foráneas)
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS mra_users (
            id INT AUTO_INCREMENT PRIMARY KEY,
            username VARCHAR(255) NOT NULL,
            firstname VARCHAR(255) NOT NULL,
            lastname VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB");
        echo "Tabla mra_users creada exitosamente.<br>";
    } catch (PDOException $e) {
        echo "Error al crear la tabla mra_users: " . $e->getMessage() . "<br>";
    }

    // Crear tabla mra_adminlist
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS mra_adminlist (
            id INT AUTO_INCREMENT PRIMARY KEY,
            admin_name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB");
        echo "Tabla mra_adminlist creada exitosamente.<br>";
    } catch (PDOException $e) {
        echo "Error al crear la tabla mra_adminlist: " . $e->getMessage() . "<br>";
    }

    // Crear tabla mra_category
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS mra_category (
            id INT AUTO_INCREMENT PRIMARY KEY,
            category_name VARCHAR(255) NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        ) ENGINE=InnoDB");
        echo "Tabla mra_category creada exitosamente.<br>";
    } catch (PDOException $e) {
        echo "Error al crear la tabla mra_category: " . $e->getMessage() . "<br>";
    }

    // Crear tabla mra_contact_activity
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS mra_contact_activity (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            contact_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            activity_description TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES mra_users(id) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB");
        echo "Tabla mra_contact_activity creada exitosamente.<br>";
    } catch (PDOException $e) {
        echo "Error al crear la tabla mra_contact_activity: " . $e->getMessage() . "<br>";
    }

    // Crear tabla mra_log_mercadoagro
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS mra_log_mercadoagro (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            log_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            log_description TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES mra_users(id) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB");
        echo "Tabla mra_log_mercadoagro creada exitosamente.<br>";
    } catch (PDOException $e) {
        echo "Error al crear la tabla mra_log_mercadoagro: " . $e->getMessage() . "<br>";
    }

    // Crear tabla mra_user_products
    try {
        $conn->exec("CREATE TABLE IF NOT EXISTS mra_user_products (
            id INT AUTO_INCREMENT PRIMARY KEY,
            user_id INT NOT NULL,
            name VARCHAR(255) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            quantity INT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
            FOREIGN KEY (user_id) REFERENCES mra_users(id) ON DELETE CASCADE ON UPDATE CASCADE
        ) ENGINE=InnoDB");
        echo "Tabla mra_user_products creada exitosamente.<br>";
    } catch (PDOException $e) {
        echo "Error al crear la tabla mra_user_products: " . $e->getMessage() . "<br>";
    }

} catch (PDOException $e) {
    echo "Error: " . $e->getMessage() . "<br>";
}
?>
