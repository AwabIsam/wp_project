<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $res;

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $title = $json["title"] ?? '';
        $desc = $json["desc"] ?? '';
        $priority = $json["priority"] ?? '';
        $due = $json["due"] ?? '';
        $userId = $_SESSION["user"]["id"];


        if (!empty($title) && !empty($due) && !empty($desc) && !empty($priority)) {
            $desc_str = json_encode($desc);
            $stmt = $conn->prepare("INSERT INTO workouts (title, description, priority, due, userId) VALUES (?, ?, ?, ?, ?)");
            $stmt->bind_param("ssssi", $title, $desc_str, $priority, $due, $userId);

            if ($stmt->execute()) {
                $inserted_id = $stmt->insert_id;

                $select_stmt = $conn->prepare("SELECT * FROM workouts WHERE workoutId = ?");
                $select_stmt->bind_param("i", $inserted_id);

                if ($select_stmt->execute()) {
                    $result = $select_stmt->get_result();
                    $row = $result->fetch_assoc();
                    if ($row) {
                        $res = ["status" => "200", "msg" => "Workout added successfully", "workout" => $row];
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