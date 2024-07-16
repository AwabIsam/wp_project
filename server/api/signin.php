<?php
    include("../config.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        header('Content-Type: application/json');

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $email = $json["email"] ?? '';
        $password = $json["password"] ?? '';

        if (!empty($email) && !empty($password)) {
            $stmt = $conn->prepare("SELECT * FROM users WHERE email = ? limit 1");
            $stmt->bind_param("s", $email);
            
            if ($stmt->execute()) {
                $result = $stmt->get_result();
                
                if ($result->num_rows == 1) {
                    $user = $result->fetch_assoc();
                    
                    // Verify password
                    if (password_verify($password, $user['password'])) {
                        $res = ["status" => "200"];
                        unset($user['password']);
                        // Store user data in session if needed
                        $_SESSION["user"] = $user;
                    } else {
                        $res = ["status" => "401", "msg" => "Incorrect password"];
                    }
                } else {
                    $res = ["status" => "404", "msg" => "No user found with matching email"];
                }
            } else {
                $res = ["status" => "500", "msg" => "Database query error"];
            }
            
            echo json_encode($res);
            
            $stmt->close();
        } else {
            $res = ["status" => "400", "msg" => "Some field is missing"];
            echo json_encode($res);
        }
    }

$conn->close();
?>
