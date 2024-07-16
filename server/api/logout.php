<?php
    include("../config.php");

    session_destroy();

    $res = ["status"=> "200"];

    echo json_encode($res);
?>