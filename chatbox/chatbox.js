//let chatbox = document.getElementById("chatbox");
//let msgInput = document.getElementById("msgInput");
let messageLog = "";
let lastMsgId = 0;
let session = getCookie("session");
let username = getCookie("username");

async function sendMsg(){
    let message = document.getElementById("msgInput").value;
    if (message != ""){
        fetch('/handleMessage.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({msg: message, username: username, session: session})
        })
        .then((response) => response.text())
        .catch((error) => console.error('ERROR:', error));
    }
    clearMsgInput();
} 

async function requestMsgLog(){
    let messageLogFetch = await fetch(`/requestLog.php?lastMsgId=${lastMsgId}`, {
        headers: {'Content-type': 'text/plain'},
        method: 'GET',
    })
        .catch((error) => console.error('ERROR:', error));

    messageLog = await messageLogFetch.text();
    if(messageLog != ""){
        messageLog = JSON.parse(messageLog); 
        displayMsgLog();
        lastMsgId = messageLog.log.at(-1).msgId;
    }
}

function displayMsgLog(){
    let chatbox = document.getElementById("chatbox");
    let log = messageLog.log;
    let scroll = false;
    if(chatbox.scrollTop === chatbox.scrollHeight - chatbox.clientHeight){
        scroll = true;
    }
    for(let i = 0; i < log.length; i++){
        let user = sanitizeInput(log[i].userName);
        let msg = sanitizeInput(log[i].msgContent);
        chatbox.innerHTML += `<span class='user'>${user}:</span> ${msg}<br>`;
    }
    if(scroll){
        chatbox.scrollTop = chatbox.scrollHeight; 
    }
}

function sanitizeInput(input) {
    return input 
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function clearMsgInput() {
    let msgInput = document.getElementById("msgInput"); 
    msgInput.value = "";
}

function getCookie(cookieName) {
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookiesArray = decodedCookie.split(';');

    for(let i = 0; i < cookiesArray.length; i++) {
        let cookie = cookiesArray[i];

        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }

        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length + 1, cookie.length); 
        }
    }
    return "";
}

function enterKeyListener(){
    if (event.key === "Enter"){
        sendMsg();
    }
}

// let msgInput = document.getElementById("msgInput").addEventListener("keydown", enterKeyListener);
setInterval(requestMsgLog, 3000);
