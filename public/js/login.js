// window.addEventListener("load", loadLoginFunctions);
loadLoginFunctions();

function loadLoginFunctions() {
    const showHiddenPasswordButton = document.querySelector(".show-password");
    showHiddenPasswordButton.addEventListener("click", showHiddenPassword);

    const formLogin = document.getElementById("form-login");
    formLogin.addEventListener("submit", (e) => {
        e.preventDefault();

        loginTry();
    });
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

async function loginTry() {
    try {
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch('/auth/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: email,
                contrasenia: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token_sesion', data.token);

            changePage("/", true);

            createNotification("normal", "success", "Inicio de Sesion Correcto", "Bienvenido/a a CAJA.");
        } else {
            console.error(data.message);
            createNotification("normal", "failed", "Inicio de Sesion Fallido", data.message);
        }

    } catch (error) { console.error(error) }
}