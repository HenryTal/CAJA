loadTrendingGames();

function loadTrendingGames() {
    const section = document.querySelector(".trending");
    const wrapper = section.querySelector(".wrapper");
    const wrapperItemsContainer = wrapper.querySelector(".wrapper-items");

    fetch(`/api/juegos/tendencias?v=${Date.now()}`)
        .then(response => {
            if (response.ok) return response.json();
            else console.error(`Error al obtener los juegos en tendencias.`);
        })
        .then(games => {
            for (let game of games) {
                wrapperItemsContainer.append(createGameItem(game));
            }

            imagesLoading();
        })
        .catch(error => console.error(error));
}

function createGameItem(game) {
    const gameContainer = document.createElement("a");
    gameContainer.href = `/juego/${game.slug}`;
    gameContainer.classList.add("wrapper-item");

    const gameCoverContainer = document.createElement("div");
    gameCoverContainer.classList.add("item-image", "cover");

    gameContainer.append(gameCoverContainer);

    const gameCoverIMG = document.createElement("img");
    gameCoverIMG.classList.add("image", "img-loading");
    gameCoverIMG.loading = "lazy";
    gameCoverIMG.src = `/image/games/${game.slug}/cover.jpg`;

    gameCoverContainer.append(gameCoverIMG);

    const gameContentContainer = document.createElement("div");
    gameContentContainer.classList.add("item-content");

    gameContainer.append(gameContentContainer);

    const gameType = document.createElement("span");
    gameType.classList.add("type");
    gameType.textContent = "Juego Base";

    const gameTitle = document.createElement("h3");
    gameTitle.classList.add("title");
    gameTitle.textContent = game.titulo;

    const gamePriceContainer = document.createElement("span");
    gamePriceContainer.classList.add("price");

    const gamePriceOffer = document.createElement("span");
    gamePriceOffer.classList.add("offer");
    gamePriceOffer.textContent = 50;

    const gamePriceBase = document.createElement("span");
    gamePriceBase.classList.add("base");
    gamePriceBase.textContent = 9.99;

    gamePriceContainer.append(gamePriceOffer, gamePriceBase);

    gameContentContainer.append(gameType, gameTitle, gamePriceContainer);

    return gameContainer;
}