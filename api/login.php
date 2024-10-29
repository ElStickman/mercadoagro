<?php
// login.php
header("Access-Control-Allow-Origin: *"); // Permitir CORS
header("Content-Type: application/json");

include 'db.php'; // Conexión a la base de datos

// Verificar si la conexión se estableció correctamente
if (!$conn) {
    echo json_encode(["error" => "No se pudo conectar a la base de datos"]);
    die();
}

// Obtener los datos enviados por POST
$data = json_decode(file_get_contents("php://input"), true);

if (isset($data['email']) && isset($data['password'])) {
    $identifier = $data['email']; // Puede ser correo electrónico o nombre de usuario
    $password = $data['password']; // Esta contraseña viene en texto plano desde el frontend

    try {
        // Buscar el usuario en la base de datos por email o username
        $stmt = $conn->prepare("SELECT * FROM mra_users WHERE email = :identifier OR username = :identifier LIMIT 1");
        $stmt->bindParam(':identifier', $identifier);
        $stmt->execute();

        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user && password_verify($password, $user['password'])) {
            // Usuario encontrado y contraseña correcta
            unset($user['password']); // Eliminar la contraseña antes de enviar la respuesta
            echo json_encode(["success" => true, "message" => "Inicio de sesión exitoso", "user" => $user]);
        } else {
            // Usuario no encontrado o contraseña incorrecta
            echo json_encode(["success" => false, "message" => "Credenciales incorrectas"]);
        }
    } catch (PDOException $e) {
        echo json_encode(["error" => $e->getMessage()]);
    }
} else {
    echo json_encode(["error" => "Datos incompletos"]);
}
?>