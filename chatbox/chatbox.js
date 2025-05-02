let messageLog = "";
let lastMsgId = 0;
let regexLink = "\\b((?:https?|ftp|file)://[-a-zA-Z0-9+&@#/%?=~_|!:, .;]*[-a-zA-Z0-9+&@#/%=~_|])";
let messageTimestamps = [new Date(0)];
allPanelIds = ["localSettingsPanel", "userSettingsPanel"];

async function sendMsg(){
    let message = document.getElementById("msgInput").value;
    message = message.trim();
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
        let userColor = log[i].userColor;
        userColor = "#" + userColor;
        let msg = sanitizeInput(log[i].msgContent);
        msg = addLinks(msg);

        let timestamp = parseDate(log[i].timestamp);
        let time = formatTime(timestamp.getHours(), timestamp.getMinutes());

        const currentMessageDay = timestamp.getDate();
        const currentMessageMonth = timestamp.getMonth();
        const lastMessageDay = messageTimestamps.at(-1).getDate();
        const lastMessageMonth = messageTimestamps.at(-1).getMonth();
        const currentDayBigger = (currentMessageDay > lastMessageDay);
        const currentMonthBigger = (currentMessageMonth > lastMessageDay);

        if (currentMonthBigger | (currentDayBigger & currentMessageMonth == lastMessageMonth)){
            addDateMessage(timestamp);
        }
        messageTimestamps.push(timestamp); 

        let messageWrapper = document.createElement("div");
        messageWrapper.className = "messageWrapper";
        let messageDiv = document.createElement("div");
        messageDiv.className = "message";

        messageDiv.innerHTML += `<span class='date'>${time}</span> `;
        messageDiv.innerHTML += `<span class='user'
        style="color:${userColor}; text-shadow: 1px 1px 1px #000000cc"> ${user}: </span>`;
        messageDiv.innerHTML += `${msg}<br>`;

        messageWrapper.appendChild(messageDiv); 

        if (countMessageLines(msg) > 8){
            addReadMore(messageWrapper, messageDiv);
        }

        chatbox.appendChild(messageWrapper); 
        addZebraEffect();
    }

    if(scroll){
        chatbox.scrollTop = chatbox.scrollHeight; 
    }
}

function addLinks(message){
    let wordArray = message.split();
    for(let i = 0; i < wordArray.length; i++){
        if(wordArray[i].match(regexLink)){
            wordArray[i] = `<a href=${wordArray[i]} tabindex=-1>${wordArray[i]}</a>`;
        }
    }
    return wordArray.join();
}

function addZebraEffect(){
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

function addDateMessage(timestamp){
    let dateDiv = document.createElement("div");
    dateDiv.className = "date";

    dateDiv.innerHTML += `<span class='dateMessage'>${timestamp.toLocaleDateString()}</span> `;
    chatbox.appendChild(dateDiv); 
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

function countMessageLines(msg){
    let lines = msg.split(/\r\n|\r|\n/).length;
    return lines;
}

function addReadMore(messageWrapper, messageDiv){
    let readMoreDiv = document.createElement("div");
    readMoreDiv.className = "readMoreButton";
    readMoreDiv.style.cursor = "pointer";
    readMoreDiv.addEventListener("click", toggleReadMore);
    readMoreDiv.innerText = 'Expand message';

    messageWrapper.appendChild(readMoreDiv);
    messageDiv.style.maxHeight = "10.5em";
    messageDiv.dataset.expanded = "false";
}

function toggleReadMore(){
    let readMoreDiv = this;
    let messageWrapper = readMoreDiv.previousElementSibling;
    if (messageWrapper.dataset.expanded === "false"){
        readMoreDiv.innerText = "Collapse message";
        messageWrapper.style.maxHeight = "";
        messageWrapper.dataset.expanded = "true";
    }
    else{
        readMoreDiv.innerText = "Expand message";
        messageWrapper.style.maxHeight = "10.5em";
        messageWrapper.dataset.expanded = "false";
    }
}

async function sendUserSettings(){
    let userColor = document.getElementById("userColor").value;
    userColor = userColor.slice(1, 7);
    if (userColor != ""){
        fetch('/handleSettings.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({userColor: userColor})
        })
            .then((response) => response.text())
            .catch((error) => console.error('ERROR:', error));
    }
    togglePanel("userSettingsPanel", allPanelIds);
}

function enterKeyListener(functionName){
    if (event.key === "Enter"){
        window[functionName]();
    }
}

function redirectPage(page){
    window.location.href = page;
}

requestMsgLog();
setInterval(requestMsgLog, 1000);
