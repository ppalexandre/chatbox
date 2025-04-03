<?php
session_start();
if(!isset($_SESSION["loggedin"])){
    header("Location: /login/"); 
    exit();
}
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbox</title>
    <link rel="icon" type="image/x-icon" href="/imgs/favicon.ico">
    <link rel="stylesheet" href="chatbox.css" type="text/css">
    <script src="chatbox.js"></script>
</head>
<body>
    <div class="header">
        <h1>Chatbox</h1>
    </div>
    <div id="chatWrapper">
        <div id="chatbox" tabindex="-1"></div>
        <form onsubmit="sendMsg(); return false" class="mainForm">
            <textarea id="msgInput" maxlength="800" onkeydown="enterKeyListener()"
                autocomplete="off" rows="5" cols="50"></textarea>
            <button id="sendButton" type="submit">Send</button>
        </form>
    </div>
    <div class="footer">
        <a href="https://github.com/ppalexandre/chatbox" target="_blank" rel="noopener noreferrer">
            <img src="/imgs/github_icon.png" alt="Github icon">
            <div>Github Repository</div>
        </a>
    </div>
</body>
</html>
