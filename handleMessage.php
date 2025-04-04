<?php
require "../sql.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $ip = $_SERVER['REMOTE_ADDR'];
    $data = json_decode(file_get_contents("php://input"));
    $msg = $data -> msg;
    $loggedin = $_SESSION["loggedin"];
    $userId = $_SESSION["userId"];
    $timestamp = gmdate("Y-m-d H:i:s");

    $msg = trim($msg);
    $msg = mysqli_real_escape_string($mysqli, $msg);

    if(isMessageSizeValid($msg) && $loggedin == true){
        sendMsg($msg, $userId, $ip, $timestamp);
    } 
}

function sendMsg($msg, $userId, $ip, $timestamp) {
    global $mysqli;

    $messageQuery = mysqli_query($mysqli, 
        "INSERT INTO messages (msg_content, user_id, msg_ip, msg_timestamp)
        VALUES('$msg', '$userId', '$ip', '$timestamp');");
}

function isMessageSizeValid($message) {
    if(empty($message) | strlen($message) > 800){
        return false;
    }
    else{
        return true;
    }
}
