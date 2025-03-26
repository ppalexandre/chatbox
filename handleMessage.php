<?php
require "../sql.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $ip = $_SERVER['REMOTE_ADDR'];
    $data = json_decode(file_get_contents("php://input"));
    $msg = $data -> msg;
    $username = $data -> username;
    $session = $data -> session;

    $username = mysqli_real_escape_string($mysqli, $username);
    $msg = mysqli_real_escape_string($mysqli, $msg);
    $session = mysqli_real_escape_string($mysqli, $session); 

    if(isUserMessageSizeValid($username, $msg) && checkSession($username, $session, $globalUserId = true)){
        sendMsg($msg, $userId, $ip);
    } 
}

function sendMsg($msg, $userId, $ip) {
    global $mysqli;

    $messageQuery = mysqli_query($mysqli, 
        "INSERT INTO messages (msg_content, user_id, msg_ip)
        VALUES('$msg', '$userId', '$ip');");
}

function checkSession($username, $session, $globalUserId = false) {
    global $mysqli;

    if($globalUserId){
        global $userId;
    }

    $userIdQuery = mysqli_query($mysqli,
        "SELECT user_id FROM users WHERE user_name='$username'");
    $userId = $userIdQuery->fetch_assoc();
    $userId = $userId["user_id"];

    if(empty($userId)){
        return false;
    }

    $sessionQuery = mysqli_query($mysqli, 
        "SELECT session FROM sessions WHERE user_id='$userId'");
    $sessionQueried = $sessionQuery->fetch_assoc();
    $sessionQueried = $sessionQueried["session"];

    if($sessionQueried == $session){
        return true;
    }
    else{
        return false;
    }
}

function isUserMessageSizeValid($username, $message) {
    if(empty($username) | empty($message)) {
        return false;
    }
    elseif(strlen($username) > 30 | strlen($message) > 800){
        return false;
    }
    else{
        return true;
    }
}
