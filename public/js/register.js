// window.addEventListener("load", loadLoginFunctions);
loadRegisterFunctions();

function loadRegisterFunctions() {
    const showHiddenPasswordButton = document.querySelector(".show-password");
    showHiddenPasswordButton.addEventListener("click", showHiddenPassword);

    const formRegister = document.getElementById("form-register");
    formRegister.addEventListener("submit", (e) => {
        e.preventDefault();

        const errors = formRegister.querySelectorAll(".error");

        for (let error of errors) {
            error.remove();
        }

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

        if (!validateForm()) return;

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

        fillPageLoadBar(80);

        if (response.ok) {
            changePage("/auth/login", true);

            createNotification("normal", "success", "Cuenta Registrada Correctamente", "Bienvenido/a a CAJA.");
        } else {
            console.error(data);
            createNotification("normal", "failed", "Registro Fallido", data.message);
        }

    } catch (error) { console.error(error) }

    fillPageLoadBar(100);
}

function validateForm() {
    const name = document.getElementById("name").value;
    const lastname = document.getElementById("lastname").value;
    const username = document.getElementById("username").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const repassword = document.getElementById("repassword").value;

    fillPageLoadBar(50);

    let errorsCount = 0;

    if (name.length < 3) {
        errorField(document.getElementById("name"), "Debe tener al menos 3 caracteres.");
        errorsCount += 1;
    }
    if (lastname.length < 3) {
        errorField(document.getElementById("lastname"), "Debe tener al menos 3 caracteres.");
        errorsCount += 1;
    }
    if (username.length < 3) {
        errorField(document.getElementById("username"), "Debe tener al menos 3 caracteres.");
        errorsCount += 1;
    }
    if (!(/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email))) {
        errorField(document.getElementById("email"), "Debe ser un correo electronico valido.");
        errorsCount += 1;
    }
    if (password.length < 8) {
        errorField(document.getElementById("password"), "Debe tener al menos 8 caracteres.");
        errorsCount += 1;
    }
    if (!(/[!@#$%^_&*(),.?":{}|<>]/.test(password))) {
        errorField(document.getElementById("password"), "Debe contener al menos un caracter especial (!@#$%^_&*).");
        errorsCount += 1;
    }
    if (!(/\d/.test(password))) {
        errorField(document.getElementById("password"), "Debe contener al menos un número.");
        errorsCount += 1;
    }
    if (password != repassword || repassword == "") {
        errorField(document.getElementById("repassword"), "Contraseñas no coinciden.");
        errorsCount += 1;
    }

    fillPageLoadBar(100);

    return errorsCount == 0;
}

function errorField(field, message) {
    const errorIcon = document.createElement("i");
    errorIcon.classList.add(iconErrorField);

    const errorMessage = document.createElement("span");
    errorMessage.classList.add("error");
    errorMessage.append(errorIcon, ` ${message}`);

    field.parentElement.append(errorMessage);
}