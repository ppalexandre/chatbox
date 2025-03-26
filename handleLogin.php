<?php
require "../sql.php";

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
            sendSession($username);
        }
        else {
            sendResponse("Error: Incorrect password");
        }
    }
}

function sendSession($username){
    global $mysqli;
    $responseMessage = "Access granted";

    $userIdQuery = mysqli_query($mysqli, 
        "SELECT user_id FROM users WHERE user_name='$username';");
    $userId = $userIdQuery->fetch_assoc();
    $userId = $userId["user_id"];

    $sessionQuery = mysqli_query($mysqli, 
        "SELECT session FROM sessions WHERE user_id='$userId';");
    $session = $sessionQuery->fetch_assoc();
    $session = $session["session"];

    if(empty($session)){
        // Generates new session and inserts it into the database
        $length = 20;
        $prefix = uniqid('', true);
        $session = substr(str_replace('.', '', $prefix), 0, $length);
        $insertSession = mysqli_query($mysqli, 
            "INSERT INTO sessions (session, user_id) 
            VALUES ('$session', '$userId');");
    }

    sendResponse($responseMessage, $session);
}

function sendResponse($responseMessage, $session = 0){
    if($session == 0){
        $response = array("responseMessage" => $responseMessage);
    }
    else{
        $response = array("responseMessage" => $responseMessage, "session" =>  $session);
    }
    echo json_encode($response);
}

?>
