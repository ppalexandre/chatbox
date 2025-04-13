<?php
session_start();
if(!isset($_SESSION["loggedin"])){
    header("Location: /login/"); 
    exit();
}
?>

<!DOCTYPE html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chatbox</title>
    <link rel="icon" type="image/x-icon" href="/imgs/favicon.ico">
    <link rel="stylesheet" href="chatbox.css" type="text/css">
    <link rel="stylesheet" href="/css/shared.css" type="text/css">
    <script src="chatbox.js"></script>
    <script src="/js/shared.js"></script>
</head>
<body>
    <div class="header">
        <h1>Chatbox</h1>
        <div id="userSettingsButton" onclick="togglePanel('userSettingsPanel')"></div>
        <div id="localSettingsButton" onclick="togglePanel('localSettingsPanel')"></div>
    </div>

    <form onsubmit="sendUserSettings(); return false" id="userSettingsPanel" class="mainForm">
        <legend>User Settings</legend>
        <label for="userColor">User Color:</label>
        <input type="color" id="userColor" name="userColor" required><br>
        <button type="submit">Save Settings</button>
    </form>

    <form onsubmit="saveLocalSettings(); return false" id="localSettingsPanel" class="mainForm">
        <legend>Local Settings</legend>
        <label for="theme">Color Theme:</label>
        <input type="text" id="theme" onclick="dropDownList(this, 'themeList')" readonly>
        <div class="dropdownMenu" id="themeList">
            <div class="dropdownOption" data-value="Automatic" 
                onclick="dropdownListOption(this, 'theme')">Automatic</div>
            <div class="dropdownOption" data-value="Light" 
                onclick="dropdownListOption(this, 'theme')">Light</div>
            <div class="dropdownOption" data-value="Dark" 
                onclick="dropdownListOption(this, 'theme')">Dark</div>
        </div>
        <button type="submit">Save Settings</button>
    </form>
    
    <div id="darkFilter"></div>
    <div id="chatWrapper">
        <div id="chatbox" tabindex="-1"></div>
        <div id="msgBar">
            <textarea id="msgInput" maxlength="800" onkeydown="enterKeyListener()"
                autocomplete="off" rows="5" cols="50"></textarea>
            <div id="sendButton" onclick="sendMsg()">Send</div>
        </div>
    </div>
    <div class="footer">
        <a href="https://github.com/ppalexandre/chatbox" target="_blank" rel="noopener noreferrer">
            <div id="githubIcon"></div>
            <div>Github Repository</div>
        </a>
    </div>
</body>
