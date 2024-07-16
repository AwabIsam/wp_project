<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $res;

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $friendId = $json["friendId"] ?? '';
        $friendName = $json["friendName"] ?? '';
        $userId = $_SESSION["user"]["id"];


        if (!empty($friendId) && !empty($friendName)) {
            $stmt = $conn->prepare("INSERT INTO friends (userId, friendId, friendName) VALUES (?, ?, ?)");
            $stmt->bind_param("iis", $userId, $friendId, $friendName);

            if ($stmt->execute()) {
                $select_stmt = $conn->prepare("SELECT * FROM friends WHERE userId = ?");
                $select_stmt->bind_param("i", $userId);

                if ($select_stmt->execute()) {
                    $result = $select_stmt->get_result();
                    $row = $result->fetch_all(MYSQLI_ASSOC);
                    if ($row) {
                        $res = ["status" => "200", "friends" => $row];
                    } else {
                        $res = ["status"=> "500", "msg"=> "Server Error. Try again later."];
                    }
                } else {
                    $res = ["status"=> "500", "msg"=> "Server Error. Try again later."];
                }

                $select_stmt->close();
            } else {
                $res = ["status"=> "500", "msg"=> "Server Error. Try again later."];
            }
        } else {
            $res = ["status"=> "400", "msg"=> "Some field is missing."];
        }

        echo json_encode($res);
    }
?>