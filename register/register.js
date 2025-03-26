async function submitForm(){
    let username = document.getElementById("username").value;
    let password = document.getElementById("password").value;
    let repassword = document.getElementById("repassword").value;

    if(password == repassword){
        let filledForm = {username:username, password:password};

        if (filledForm.username != "" | filledForm.password != ""){
            var createUserRequest = await fetch('/handleRegister.php', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(filledForm)
            })
            .catch((error) => console.error('ERROR:', error));
        }
        let response = await createUserRequest.text();
        let errorBox = document.getElementById("errorBox");
        errorBox.innerText = response;
        clearForm();
    }

    else{
        let errorBox = document.getElementById("errorBox");
        errorBox.innerText = "Passwords don't match!";
    }
} 

function clearForm() {
    let usernameElement = document.getElementById("username");
    let passwordElement = document.getElementById("password");
    let repasswordElement = document.getElementById("repassword");
    usernameElement.value = "";
    passwordElement.value = "";
    repasswordElement.value = "";
}
