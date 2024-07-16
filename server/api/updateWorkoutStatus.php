<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $res;

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $workoutId = $json["workoutId"] ?? '';
        $status = $json["status"] ?? '';

        if ($status == "completed" || $status == "pending") {
            if (!empty($workoutId) && !empty($status)) {
                $stmt = $conn->prepare("UPDATE workouts SET status = ? WHERE workoutId = ?");
                $stmt->bind_param("si", $status, $workoutId);

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
            $res = ["status"=> "400", "msg"=> "Status has to be completed/pending"];
        }

        echo json_encode($res);
    }
?>