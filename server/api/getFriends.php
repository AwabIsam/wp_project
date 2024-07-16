<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "GET") {
        $res;

        $user = $_SESSION["user"];

        $stmt = $conn->prepare("SELECT id,userId, friendName, friendId FROM friends WHERE userId=?");
        $stmt->bind_param("s", $user["id"]);
        $stmt->execute();

        $result = $stmt->get_result();
        $friends = $result->fetch_all(MYSQLI_ASSOC);

        $select_stmt = $conn->prepare("SELECT id, name
        FROM users u
        WHERE id != ?
        AND NOT EXISTS (
            SELECT 1
            FROM friends f
            WHERE f.userId = ?
            AND f.friendId = u.id
        );");
        $select_stmt->bind_param("ss", $user["id"], $user["id"]);
        $select_stmt->execute();

        $select_result = $select_stmt->get_result();
        $users = $select_result->fetch_all(MYSQLI_ASSOC);

        if ($friends && $users) {
            $res = ["status"=> "200", "friends"=> $friends, "users"=> $users];
        } elseif (!$friends && $users) {
            $res = ["status"=> "200", "users"=> $users];
        } elseif ($friends && !$users) {
            $res = ["status"=> "200", "friends"=> $friends];
        } else {
            $res = ["status"=> "200"];
        } 

        $select_stmt->close();
        $stmt->close();
        
        echo json_encode($res);
    }

    $conn->close();
?>
