<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $res;

        $user = $_SESSION["user"];

        if ($user) {
            $stmt = $conn->prepare("SELECT id, name, email FROM users WHERE id=?");
            $stmt->bind_param("s", $user["id"]);

            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $user = $result->fetch_assoc();

                if ($result->num_rows > 0) {
                    $workout_stmt = $conn->prepare("SELECT * FROM workouts WHERE userid=?");
                    $workout_stmt->bind_param("s", $user["id"]);

                    if ($workout_stmt->execute()) {
                        $workout_res = $workout_stmt->get_result();
                        $workout = $workout_res->fetch_all(MYSQLI_ASSOC);

                        $res= ["status"=> "200", "workouts"=> $workout, "user"=> $user];
                    } else {
                        $res = ["status"=> "404", "msg"=> "No workouts found"];
                    }
                    $workout_stmt->close();
                }

            } else {
                $res = ["status"=> "500", "msg"=> "Server Error. Try Again Later."];
            }

            $stmt->close();
        } else {
            $res = ["status"=> "401", "msg"=> "Unauthorized"];

        }
        
        echo json_encode($res);
    }

    $conn->close();
?>
