<?php
require "../sql.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    $ip = $_SERVER['REMOTE_ADDR'];
    $data = json_decode(file_get_contents("php://input"));
    $userColor = $data -> userColor;
    $loggedin = $_SESSION["loggedin"];
    $userId = $_SESSION["userId"];

    $userColor = mysqli_real_escape_string($mysqli, $userColor);

    if(isColorValueValid($userColor) && $loggedin == true){
        storeUserSettings($userId, $userColor);
    } 
}

function storeUserSettings($userId, $userColor) {
    global $mysqli;

    $userColorQuery = mysqli_query($mysqli, 
        "UPDATE users SET user_color='$userColor' WHERE user_id=$userId");
}

function isColorValueValid($userColor) {
    $colorRegex = "/^[A-Fa-f0-9]{6}$/";

    if(preg_match($colorRegex, $userColor)){
        return true;
    }
    else{
        return false;
    }
}
?>
