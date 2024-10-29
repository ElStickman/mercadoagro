<?php
// getProducts.php
header("Access-Control-Allow-Origin: *"); // Permitir CORS
header("Content-Type: application/json");

include 'db.php'; // Conexión a la base de datos

// Verificar si la conexión se estableció correctamente
if (!$conn) {
    echo json_encode(["error" => "No se pudo conectar a la base de datos"]);
    die();
}

try {
    // Cambiar la consulta a la tabla que desees, en este caso mra_user_products
    $stmt = $conn->prepare("SELECT * FROM mra_user_products");
    $stmt->execute();

    $products = $stmt->fetchAll(PDO::FETCH_ASSOC);
    echo json_encode($products);
} catch (PDOException $e) {
    echo json_encode(["error" => $e->getMessage()]);
}
?>
