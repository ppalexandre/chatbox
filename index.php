<?php
session_start();
if(isset($_SESSION["loggedin"])){
    header("Location: /chatbox/"); 
}
else{
    header("Location: /login/"); 
}
exit();
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <link rel="icon" type="image/x-icon" href="/imgs/favicon.ico">
    <title>Chatbox</title>
</head>
<body>
</body>
</html>
