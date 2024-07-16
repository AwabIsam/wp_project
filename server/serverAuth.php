<?php
    if(!isset($_SESSION["user"]))      // if there is no valid session
    {
        $res = ["status"=> "401", "msg"=> "Unauthorized"];
        
        echo json_encode($res);
        exit();
    }
?>