let rootElement = document.querySelector(":root");
let themeCookieValue = "";
let allPanelIds = ["localSettingsPanel"];

function setVar(varName, color){
    rootElement.style.setProperty(varName, color);
}

function toggleDarkMode(darkMode){
    if (darkMode){
        setVar("--backgroundColor", "#36363f");
        setVar("--baseColor", "#4a4a4d");
        setVar("--baseColorLight", "#48484b");
        setVar("--baseColorHeavy", "#4b4b4f");
        setVar("--baseColorHeaviest", "#454548");
        setVar("--headerColor", "#2f2f35");
        setVar("--footerColor", "#323237");
        setVar("--textColor", "#f5f5f5");
        setVar("--textShadowColor", "#000000aa");
        setVar("--dateColor", "#aaaaaa");
        setVar("--boxShadowColor", "#03030345");
        setVar("--boxShadowColorHeavy", "#03030370");
        setVar("--boxShadowColorLight", "#00000020");
        setVar("--borderColor", "#050505");
        setVar("--linkColor", "#6666ff");
        setVar("--errorBoxColor", "#ff5555");
        setVar("--githubIconURL", "url('/imgs/github-white.png')");
        setVar("--userIconURL", "url('/imgs/user-white.png')");
        setVar("--cogIconURL", "url('/imgs/cog-white.png')");
    }
    else{
        setVar("--backgroundColor", "#dfdfdf");
        setVar("--baseColor", "#ffffff");
        setVar("--baseColorLight", "#ffffff");
        setVar("--baseColorHeavy", "#f6f6f6");
        setVar("--baseColorHeaviest", "#f0f0f0");
        setVar("--headerColor", "#cbcbcb");
        setVar("--footerColor", "#bbbbbb");
        setVar("--textColor", "#030305");
        setVar("--textShadowColor", "#ffffffaa");
        setVar("--dateColor", "#707070");
        setVar("--boxShadowColor", "#0303045");
        setVar("--boxShadowColorHeavy", "#03030370");
        setVar("--boxShadowColorLight", "#00000020");
        setVar("--borderColor", "#050505");
        setVar("--linkColor", "#5555bb");
        setVar("--errorBoxColor", "#cc2222");
        setVar("--githubIconURL", "url('/imgs/github-black.png')");
        setVar("--userIconURL", "url('/imgs/user-black.png')");
        setVar("--cogIconURL", "url('/imgs/cog-black.png')");
    }
}

function togglePanel(chosenPanelId, panelIds = allPanelIds){
    let chosenPanel = document.getElementById(chosenPanelId);
    let darkFilter = document.getElementById("darkFilter");

    for (let i = 0; i < panelIds.length; i++){
        if(panelIds[i] === chosenPanelId){
            if(chosenPanel.style.display == ""){
                chosenPanel.style.display = "block";
                darkFilter.style.display = "initial";
            }
            else{
                chosenPanel.style.display = "";
                darkFilter.style.display = "";
            }
        }
        else{
            let panel = document.getElementById(panelIds[i]);
            panel.style.display = "";
        }
    }
}

function dropDownList(inputElement, dropdownElementId){
    let dropdownElement = document.getElementById(dropdownElementId); 
    dropdownElement.style.display = "block";
}

function dropdownListOption(optionElement, inputElementId){
    let parentElement = optionElement.parentElement; 
    let inputElement = document.getElementById(inputElementId);
    let value = optionElement.getAttribute("data-value");
    inputElement.value = value; 
    parentElement.style.display = "";
}

function getCookie(cookieName) {
    cookieName = cookieName + "=";
    let decodedCookie = decodeURIComponent(document.cookie);
    let cookieArray = decodedCookie.split(';');
    for (let i = 0; i < cookieArray.length; i++) {
        let cookie = cookieArray[i];
        while (cookie.charAt(0) == ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(cookieName) == 0) {
            return cookie.substring(cookieName.length, cookie.length);
        }
    }
    return "";
}

function setCookie(cookieName, value){
    document.cookie = `${cookieName}=${value}; path=/`; 
}

function saveLocalSettings(){
    // let settingsPanel = document.getElementById("localSettingsPanel");
    let theme = document.getElementById("theme").value.toLowerCase();
    setCookie("theme", theme);
    checkTheme();
    togglePanel("localSettingsPanel");
}

function checkTheme(){
    themeCookieValue = getCookie("theme");
    if (themeCookieValue === "dark"){
        toggleDarkMode(true);
    }
    else if (themeCookieValue === "light"){
        toggleDarkMode(false);
    }
    else if (themeCookieValue == "" || themeCookieValue == "automatic"){
        if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
            toggleDarkMode(true);
        }
        else{
            toggleDarkMode(false);
        }
    }
}

// Checks for changes in themes if theme is automatic
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
    checkTheme();
});

checkTheme();
