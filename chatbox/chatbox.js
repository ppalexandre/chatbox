//let chatbox = document.getElementById("chatbox");
//let msgInput = document.getElementById("msgInput");
let messageLog = "";
let lastMsgId = 0;

async function sendMsg(){
    let message = document.getElementById("msgInput").value;
    if (message != ""){
        fetch('/handleMessage.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({msg: message})
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
        let timestamp = parseDate(log[i].timestamp);
        let time = formatTime(timestamp.getHours(), timestamp.getMinutes());

        let messageDiv = document.createElement("div");
        messageDiv.className = "message";

        messageDiv.innerHTML += `<span class='date'>${time}</span> `;
        messageDiv.innerHTML += `<span class='user'>${user}: </span>`;
        messageDiv.innerHTML += `${msg}<br>`;

        chatbox.appendChild(messageDiv); 
        colorAllMessages();
    }

    if(scroll){
        chatbox.scrollTop = chatbox.scrollHeight; 
    }
}

function colorAllMessages(){
    messages = document.getElementsByClassName("message");
    for(let i = 0; i < messages.length; i++){
        let message = messages[i];
        if(i % 2 == 0){
            message.className = "message messageDark";
        }
        else{
            message.className = "message messageLight";
        }
    }
}

function sanitizeInput(input){
    return input 
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function clearMsgInput(){
    let msgInput = document.getElementById("msgInput"); 
    msgInput.value = "";
}

function parseDate(date){
    date = date.split(/[- :]/);
    let parsedDate = new Date(Date.UTC(date[0], date[1], date[2], date[3], date[4], date[5]));
    return parsedDate;
}

function formatTime(hours, minutes){
    hours = hours.toString();
    minutes = minutes.toString();
    if (hours.length < 2){
        hours = "0" + hours;
    }
    if (minutes.length < 2){
        minutes = "0" + minutes;
    }
    let time = `${hours}:${minutes}`; 
    return time;
}

function enterKeyListener(){
    if (event.key === "Enter"){
        sendMsg();
    }
}

function redirectPage(page){
    window.location.href = page;
}

// let msgInput = document.getElementById("msgInput").addEventListener("keydown", enterKeyListener);
requestMsgLog();
setInterval(requestMsgLog, 3000);
