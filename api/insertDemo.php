<?php
// insertDemo.php

include 'db.php';

try {
    // Insertar datos en la tabla mra_users
    $conn->exec("INSERT INTO mra_users (firstname, lastname, email, password) VALUES
        ('Juan', 'Perez', 'juan.perez@example.com', 'password123'),
        ('Maria', 'Lopez', 'maria.lopez@example.com', 'password456')");

    // Insertar datos en la tabla mra_category
    $conn->exec("INSERT INTO mra_category (category_name) VALUES
        ('Electrónica'),
        ('Ropa'),
        ('Hogar')");

    // Insertar datos en la tabla mra_user_products
    $conn->exec("INSERT INTO mra_user_products (user_id, name, description, price, quantity) VALUES
        (1, 'Televisión', 'Televisión 42 pulgadas', 300.00, 10),
        (2, 'Camisa', 'Camisa de algodón talla M', 20.00, 50)");

    echo "Datos insertados exitosamente.";
} catch (PDOException $e) {
    echo "Error: " . $e->getMessage();
}
?>
