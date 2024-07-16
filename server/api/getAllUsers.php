<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $res;

        $user = $_SESSION["user"];

        $stmt = $conn->prepare("SELECT id, name FROM users LIMIT 20");

        if ($stmt->execute()) {
            $result = $stmt->get_result();
            $users = $result->fetch_all(MYSQLI_ASSOC);

            $res = ["status"=> "200", "users"=> $users];
        } else {
            $res = ["status"=> "500", "msg"=> "Server Error. Try Again Later."];
        }

        $stmt->close();
        
        echo json_encode($res);
    }

    $conn->close();
?>
