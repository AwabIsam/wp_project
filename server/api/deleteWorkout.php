<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $res;

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $workoutId = $json["workoutId"] ?? '';

            if (!empty($workoutId)) {
                $stmt = $conn->prepare("DELETE FROM workouts WHERE workoutId = ?;");
                $stmt->bind_param("i", $workoutId);

                if ($stmt->execute()) {
                    $res = ["status"=> "200"];
                } else {
                    $res = ["status"=> "500", "msg"=> "Unable to update workout."];
                }
                
                $stmt->close();
            } else {
                $res = ["status"=> "400", "msg"=> "Some field is missing."];
            }

        echo json_encode($res);
    }
?>