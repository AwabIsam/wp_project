<?php
    try {
        $servername = "localhost";
        $username = "root";
        $password = "";
        $dbname = "wp_project";
        
        $conn = mysqli_connect($servername, $username, $password, $dbname);

    } catch (mysqli_sql_exception) {
        echo"Connection failed: " . $conn->connect_error;

    }
?>