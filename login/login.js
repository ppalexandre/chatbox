async function submitForm(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;

    let filledForm = {username:username, password:password};

    if (filledForm.username != "" | filledForm.password != ""){
        var loginRequest = await fetch('/handleLogin.php', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify(filledForm)
        })
        .catch((error) => console.error('ERROR:', error));
        let response = await loginRequest.text();

        if (response != ""){
            response = JSON.parse(response); 
            if (response.login == true){
                redirectPage("/chatbox/");
            }
            let errorBox = document.getElementById("errorBox");
            errorBox.innerText = response.responseMessage;
        }
        clearForm();
    }
} 

function clearForm(){
    let usernameElement = document.getElementById("username");
    let passwordElement = document.getElementById("password");
    usernameElement.value = "";
    passwordElement.value = "";
}

function redirectPage(page){
    window.location.href = page;
}
