<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $res;

        $id = $_SESSION["user"]["id"];

        $stmt = $conn->prepare("SELECT admin_control FROM users WHERE id = ?");
        $stmt->bind_param("i", $id);

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $role = $result->fetch_assoc();

            $res = ["status"=> "200","role" => $role];
        } else {
            $res = ["status"=> "500", "msg"=> "Unable to update workout."];
        }
                
        $stmt->close();
        } else {
            $res = ["status"=> "400", "msg"=> "Some field is missing."];
        }

        echo json_encode($res);
?>