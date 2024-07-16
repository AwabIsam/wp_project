<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $res;

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $id = $json["id"] ?? '';

        if (!empty($id)) {
            // Begin a transaction
            $conn->begin_transaction();

            try {
                // Delete from workouts table
                $stmt = $conn->prepare("DELETE FROM workouts WHERE userId = ?;");
                $stmt->bind_param("i", $id);

                if (!$stmt->execute()) {
                    throw new Exception("Unable to delete workouts.");
                }

                $stmt->close();

                // Delete from friends table where the user is referenced as a userId or friendId
                $stmt = $conn->prepare("DELETE FROM friends WHERE userId = ? OR friendId = ?;");
                $stmt->bind_param("ii", $id, $id);

                if (!$stmt->execute()) {
                    throw new Exception("Unable to delete friends.");
                }

                $stmt->close();

                // Delete from users table
                $stmt = $conn->prepare("DELETE FROM users WHERE id = ?;");
                $stmt->bind_param("i", $id);

                if (!$stmt->execute()) {
                    throw new Exception("Unable to delete user.");
                }

                $stmt->close();

                // Commit the transaction
                $conn->commit();
                $res = ["status" => "200"];

            } catch (Exception $e) {
                // Rollback the transaction if something failed
                $conn->rollback();
                $res = ["status" => "500", "msg" => $e->getMessage()];
            }

        } else {
            $res = ["status" => "400", "msg" => "Some field is missing."];
        }

        echo json_encode($res);
    }
?>
