// window.addEventListener("load", loadTrendingGames);
loadTrendingGames();

function loadTrendingGames() {
    fetch(`/api/juegos/tendencias?v=${Date.now()}`)
        .then(response => {
            if (response.ok) return response.json();
            else console.error(`Error al obtener los juegos en tendencias.`);
        })
        .then(games => {
            loadGamesInWrapper(".trending", games);
        })
        .catch(error => console.error(error));
}