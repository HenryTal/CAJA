// window.addEventListener("load", loadLoginFunctions);
loadRegisterFunctions();

function loadRegisterFunctions() {
    const showHiddenPasswordButton = document.querySelector(".show-password");
    showHiddenPasswordButton.addEventListener("click", showHiddenPassword);

    const formRegister = document.getElementById("form-register");
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();

        registerTry();
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

async function registerTry() {
    try {
        const name = document.getElementById("name").value;
        const lastname = document.getElementById("lastname").value;
        const username = document.getElementById("username").value;
        const email = document.getElementById("email").value;
        const password = document.getElementById("password").value;

        const response = await fetch('/auth/register', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: name,
                lastname: lastname,
                username: username,
                email: email,
                password: password
            })
        });

        const data = await response.json();

        if (response.ok) {
            changePage("/auth/login", true);

            createNotification("normal", "success", "Cuenta Registrada Correctamente", "Bienvenido/a a CAJA.");
        } else {
            console.error(data.message);
            createNotification("normal", "failed", "Registro Fallido", data.message);
        }

    } catch (error) { console.error(error) }
}