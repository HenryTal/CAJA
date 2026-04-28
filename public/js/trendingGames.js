window.addEventListener("load", loadTrendingGames);

let iconFavorite = "ri-poker-hearts-line";
let iconInFavorite = "ri-poker-hearts-fill";

async function loadTrendingGames() {
    const section = document.querySelector(".trending");

    if (!section) return;

    const wrapper = section.querySelector(".wrapper");
    const wrapperItemsContainer = wrapper.querySelector(".wrapper-items");

    const wishList = await getWishListUser();

    fetch(`/api/juegos/tendencias?v=${Date.now()}`)
        .then(response => {
            if (response.ok) return response.json();
            else console.error(`Error al obtener los juegos en tendencias.`);
        })
        .then(games => {
            wrapperItemsContainer.innerHTML = "";
            
            for (let game of games) {
                game.en_lista_de_deseos = wishList.findIndex(gameWish => gameWish.id_juego == game.id) != -1;
                wrapperItemsContainer.append(createGameItem(game));
            }

            moveWrapperItems(wrapper)
            imagesLoading();
        })
        .catch(error => console.error(error));
}