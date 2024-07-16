<?php
    include("../config.php");
    include("../serverAuth.php");

    if ($_SERVER["REQUEST_METHOD"] === "POST") {
        $res;

        $data = file_get_contents("php://input");
        $json = json_decode($data, true);

        $searchTerm = $json["searchTerm"] ?? '';

        if (!empty($searchTerm)) {
            $searchTerm = "%" . $searchTerm . "%"; 
            $stmt = $conn->prepare("SELECT id,name FROM users WHERE name LIKE ? LIMIT 5");
            $stmt->bind_param("s", $searchTerm);

            if ($stmt->execute()) {
                $result = $stmt->get_result();
                $users = $result->fetch_all(MYSQLI_ASSOC);

                if ($users) {
                    $res = ["status"=> "200", "users"=> $users];
                } else {
                    $res = ["status"=> "404", "msg"=> "No users with a similar name found."];
                }
            } else {
                $res = ["status"=> "500", "msg"=> "Server Error. Try again later."];
            }

            $stmt->close();
        } else {
            $res = ["status"=> "400", "msg"=> "Search term is empty."];
        }

        echo json_encode($res);
    }


    $conn->close();
?>
