loadUserDetails();

async function loadUserDetails() {
    try {
        let wishList = [];
        let gamesPurchased = [];

        const username = location.href.split("/usuario/")[1].split("/")[0];

        const response = await fetch(`/api/usuarios/${username}`);
        const infoViewer = await getInfoUser();

        const data = await response.json();

        if (response.ok) {
            const usernameContainer = document.getElementById("username");
            usernameContainer.textContent = `${data.nombre_usuario}${(infoViewer.nombre_usuario == data.nombre_usuario) ? " (Dashboard)" : ""}`;

            wishList = data.Juegos.filter(game => game.Usuario_Juegos.en_lista_de_deseos);
            gamesPurchased = data.Juegos.filter(game => game.Usuario_Juegos.lo_tiene);

            loadGamesInWrapper(".wishlist", wishList, true);
            loadGamesInWrapper(".games-purchased", gamesPurchased, true);

            const detailsContainer = document.querySelector(".section.details");
            detailsContainer.classList.remove("loading");
        } else {
            createNotification("normal", "failed", "Perfil de Usuario", "Usuario no Encontrado");
        }
    } catch (error) { console.error(error) }
}