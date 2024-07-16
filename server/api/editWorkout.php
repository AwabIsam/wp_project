<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $res;

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $workoutId = $json["workoutId"] ?? '';
        $title = $json["title"] ?? '';
        $desc = $json["desc"] ?? '';
        $priority = $json["priority"] ?? '';
        $due = $json["due"] ?? '';

        if ($priority == "low" || $priority =="medium" || $priority == "high") {
            if (!empty($workoutId) && !empty($title) && !empty($desc) && !empty($priority) && !empty($due)) {
                $desc_str = json_encode($desc);
                $stmt = $conn->prepare("UPDATE workouts SET title = ?, description = ?, priority = ?, due = ? WHERE workoutId = ?");
                $stmt->bind_param("ssssi", $title, $desc_str, $priority, $due, $workoutId);

                if ($stmt->execute()) {
                    $select_stmt = $conn->prepare("SELECT * FROM workouts WHERE workoutId = ?");
                    $select_stmt->bind_param("i", $workoutId);

                    if ($select_stmt->execute()) {
                        $result = $select_stmt->get_result();
                        $row = $result->fetch_assoc();
                        if ($row) {
                            $res = ["status"=> "200", "workout"=> $row];
                        } else {
                        $res = ["status"=> "500", "msg"=> "Server Error. Try again later."];
                        }
                    } else {
                        $res = ["status"=> "500", "msg"=> "Server Error. Try again later."];
                    }
                    
                    $select_stmt->close();
                } else {
                    $res = ["status"=> "500", "msg"=> "Unable to update workout."];
                }
                
                $stmt->close();
            } else {
                $res = ["status"=> "400", "msg"=> "Some field is missing."];
            }
        } else {
            $res = ["status"=> "400", "msg"=> "Priority has to be low/medium/high"];
        }

        echo json_encode($res);
    }
?>