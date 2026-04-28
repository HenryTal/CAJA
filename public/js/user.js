loadUserDetails();

async function loadUserDetails() {
    try {
        const username = location.href.split("/usuario/")[1].split("/")[0];

        const response = await fetch(`/api/usuarios/${username}`);

        const data = await response.json();

        if (response.ok) {
            const usernameContainer = document.getElementById("username");
            usernameContainer.textContent = data.nombre_usuario;

            const detailsContainer = document.querySelector(".section.details");
            detailsContainer.classList.remove("loading");
        } else {
            createNotification("normal", "failed", "Perfil de Usuario", "Usuario no Encontrado");
        }
    } catch (error) { console.error(error) }
}