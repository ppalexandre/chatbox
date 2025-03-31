<?php
require "../sql.php";

if ($_SERVER["REQUEST_METHOD"] === "POST") {
    // $ip = $_SERVER['REMOTE_ADDR'];
    $data = json_decode(file_get_contents("php://input"));
    $username = $data -> username;
    $password = $data -> password;

    $username = mysqli_real_escape_string($mysqli, $username);
    $password = mysqli_real_escape_string($mysqli, $password);

    if(isUserLoginSizeValid($username, $password)){
        checkUser();
    } 
}


function checkUser() {
    global $mysqli, $username, $password;
    $usernameQuery = mysqli_query($mysqli, "SELECT COUNT(user_name) FROM users WHERE user_name='$username';");
    $usernameCount = $usernameQuery->fetch_assoc();
    $usernameCount = $usernameCount["COUNT(user_name)"];

    if($usernameCount > 0){
        echo "Error, username already taken.";
    }
    else{
        createUser($username, $password);
        echo "User account created successfully.";
    }
}

function createUser($f_username, $f_password) {
    global $mysqli;
    $hashed_password = password_hash($f_password, PASSWORD_DEFAULT);
    $insertUser = mysqli_query($mysqli, 
        "INSERT INTO users (user_name, password_hash)
        VALUES('$f_username', '$hashed_password');");
}

function isUserLoginSizeValid($username, $password) {
    if(empty($username) | empty($password)) {
        return false;
    }
    elseif(strlen($username) > 30 | strlen($password) > 100){
        return false;
    }
    else{
        return true;
    }
}

?>
