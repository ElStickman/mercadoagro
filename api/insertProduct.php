<?php
// insertProduct.php
header("Access-Control-Allow-Origin: *"); // Permitir CORS
header("Content-Type: application/json");

include 'db.php'; // Conexión a la base de datos

// Verificar si la conexión se estableció correctamente
if (!$conn) {
    echo json_encode(["error" => "No se pudo conectar a la base de datos"]);
    die();
}

// Obtener datos enviados por POST
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['name']) && isset($data['price'])) {
    try {
        $stmt = $conn->prepare("INSERT INTO mra_user_products (name, price) VALUES (:name, :price)");
        $stmt->bindParam(':name', $data['name']);
        $stmt->bindParam(':price', $data['price']);
        $stmt->execute();

        echo json_encode(["message" => "Producto insertado exitosamente"]);
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}
?>
