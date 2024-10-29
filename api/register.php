<?php
// register.php
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

if (isset($data['username']) && isset($data['email']) && isset($data['password']) && isset($data['firstname']) && isset($data['lastname'])) {
    $username = $data['username'];
    $email = $data['email'];
    $firstname = $data['firstname'];
    $lastname = $data['lastname'];
    $password = password_hash($data['password'], PASSWORD_DEFAULT); // Hashear la contraseña

    try {
        // Verificar si el email ya existe
        $checkEmailStmt = $conn->prepare("SELECT * FROM mra_users WHERE email = :email");
        $checkEmailStmt->bindParam(':email', $email);
        $checkEmailStmt->execute();
        if ($checkEmailStmt->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "El correo electrónico ya está registrado"]);
            die();
        }

        // Verificar si el nombre de usuario ya existe
        $checkUsernameStmt = $conn->prepare("SELECT * FROM mra_users WHERE username = :username");
        $checkUsernameStmt->bindParam(':username', $username);
        $checkUsernameStmt->execute();
        if ($checkUsernameStmt->rowCount() > 0) {
            echo json_encode(["success" => false, "message" => "El nombre de usuario ya está registrado"]);
            die();
        }

        // Insertar el nuevo usuario en la base de datos
        $stmt = $conn->prepare("INSERT INTO mra_users (username, email, firstname, lastname, password) VALUES (:username, :email, :firstname, :lastname, :password)");
        $stmt->bindParam(':username', $username);
        $stmt->bindParam(':email', $email);
        $stmt->bindParam(':firstname', $firstname);
        $stmt->bindParam(':lastname', $lastname);
        $stmt->bindParam(':password', $password);
        $stmt->execute();

        echo json_encode(["success" => true, "message" => "Usuario registrado exitosamente"]);
    } catch (PDOException $e) {
        // Mostrar error específico
        echo json_encode(["success" => false, "message" => "Error al registrar usuario: " . $e->getMessage()]);
    }
} else {
    echo json_encode(["success" => false, "message" => "Datos incompletos"]);
}
?>
