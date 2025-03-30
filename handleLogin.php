<?php
require "../sql.php";
session_start();

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    //$ip = $_SERVER['REMOTE_ADDR'];
    $data = json_decode(file_get_contents("php://input"));
    $username = $data -> username;
    $password = $data -> password;

    $username = mysqli_real_escape_string($mysqli, $username);
    $password = mysqli_real_escape_string($mysqli, $password);

    if(!empty($username) && !empty($password)) {
        checkLogin($username, $password);
    } 
}

function checkLogin($username, $password) {
    global $mysqli;
    $passwordHashQuery = mysqli_query($mysqli, 
        "SELECT password_hash FROM users WHERE user_name='$username';");
    $passwordHash = $passwordHashQuery->fetch_assoc();
    $passwordHash = $passwordHash["password_hash"];

    if (empty($passwordHash)) {
        sendResponse("Error: Username not found");
    }

    else{
        $isPasswordCorrect = password_verify($password, $passwordHash);

        if ($isPasswordCorrect){
            $_SESSION["loggedin"] = true;
            $_SESSION["username"] = $username;
            $_SESSION["userId"] = getUserId($username);
            sendResponse("Access granted", true);
        }
        else {
            sendResponse("Error: Incorrect password");
        }
    }
}

function getUserId($username){
    global $mysqli;
    $userIdQuery = mysqli_query($mysqli, 
        "SELECT user_id FROM users WHERE user_name='$username';");
    $userId = $userIdQuery->fetch_assoc();
    $userId = $userId["user_id"];
    return $userId;
}

function sendResponse($responseMessage, $login = false){
    if($login == false){
        $response = array("responseMessage" => $responseMessage);
    }
    else{
        $response = array("responseMessage" => $responseMessage, "login" => $login);
    }
    echo json_encode($response);
}

?>
