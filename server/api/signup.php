<?php
    include("../config.php");

    function userExists($conn, $name, $email) {
        // Prepared statement
        $stmt = $conn->prepare("SELECT COUNT(*) as count FROM users WHERE name = ? OR email = ?");
        $stmt->bind_param("ss", $name, $email);
        $stmt->execute();
        $result = $stmt->get_result();
        
        // Fetch the result as an associative array
        $row = $result->fetch_assoc();
        
        // Check if count > 0
        if ($row['count'] > 0) {
            return true; // User exists
        } else {
            return false; // User does not exist
        }
    }

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        header('Content-Type: application/json');

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $name = $json["name"] ?? '';
        $email = $json["email"] ?? '';
        $password = $json["password"] ?? '';

        if (!empty($name) && !empty($email) && !empty($password)) {
            $res;
            if (userExists($conn, $name, $email)) {
                $res = ["status" => "409", "msg" => "User with the same name or email already exists."];
            } else {
                $password = password_hash($password, PASSWORD_DEFAULT); // Example password hash

                $stmt = $conn->prepare("INSERT INTO Users (name, email, password) VALUES (?, ?, ?)");
                $stmt->bind_param("sss", $name, $email, $password);

                if ($stmt->execute()) {
                    $inserted_id = $stmt->insert_id;

                    $select_stmt = $conn->prepare("SELECT * FROM Users WHERE id = ?");
                    $select_stmt->bind_param("i", $inserted_id);

                    if ($select_stmt->execute()) {
                        $result = $select_stmt->get_result();
                
                        if ($result->num_rows > 0) {
                            $user = $result->fetch_assoc();

                            $res = ["status"=> "200"];
                            unset($user['password']);
                            
                            $_SESSION["user"] = $user;
                        } else {
                            $res = ["status"=> "500", "msg"=> "Unable to create user."];
                        }
                    } else {
                        $res = ["status"=> "500", "msg"=> "Server Error. Try Again Later."];
                    }

                    $select_stmt->close();
                } else {
                    $res = ["status"=> "500", "msg"=> "Server Error. Try Again Later."];
                }

                $stmt->close();
            }

            echo json_encode($res);
        } else {
            $res = ["status" => "400", "msg" => "Some field is missing"];
            echo json_encode($res);
        }
    }

$conn->close();
?>
