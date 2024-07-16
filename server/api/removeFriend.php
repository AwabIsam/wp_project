<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $res;

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $id = $json["id"] ?? '';

            if (!empty($id)) {
                $stmt = $conn->prepare("DELETE FROM friends WHERE id = ?;");
                $stmt->bind_param("i", $id);

                if ($stmt->execute()) {
                    $res = ["status"=> "200"];
                } else {
                    $res = ["status"=> "500", "msg"=> "Unable to remove friend."];
                }
                
                $stmt->close();
            } else {
                $res = ["status"=> "400", "msg"=> "Some field is missing."];
            }

        echo json_encode($res);
    }
?>