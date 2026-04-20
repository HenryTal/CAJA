window.addEventListener("load", loadLoginFunctions);

// Clases para los iconos de mostrar y ocultar contraseña.
let iconShowPassword = "ri-eye-close-line";
let iconHiddenPassword = "ri-eye-line";

function loadLoginFunctions() {
    const showHiddenPasswordButton = document.querySelector(".show-password");

    showHiddenPasswordButton.addEventListener("click", showHiddenPassword);
}

function showHiddenPassword(e) {
    const passwordContainer = document.querySelector("#password");
    const iconButton = e.target.tagName == "I" ? e.target : e.target.querySelector("i");
    
    const isShowPassword = (passwordContainer.type == "text");
    
    if (isShowPassword) {
        passwordContainer.type = "password";
        iconButton.className = iconShowPassword;
    }
    else {
        passwordContainer.type = "text";
        iconButton.className = iconHiddenPassword;
    }
}