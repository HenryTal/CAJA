loadTrendingGames();

let iconFavorite = "ri-poker-hearts-line";
let iconInFavorite = "ri-poker-hearts-fill";

async function loadTrendingGames() {
    const section = document.querySelector(".trending");
    const wrapper = section.querySelector(".wrapper");
    const wrapperItemsContainer = wrapper.querySelector(".wrapper-items");


    wrapperItemsContainer.innerHTML = "";


    const buttonTestLogin = document.getElementById("buttonLogin");
    buttonTestLogin.addEventListener("click", loginTest);

    const token = localStorage.getItem('token_sesion');

    const wishListResponse = await fetch(`/api/usuarios/wishlist/get`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

    const wishList = await wishListResponse.json();

    console.log(wishList);

    fetch(`/api/juegos/tendencias?v=${Date.now()}`)
        .then(response => {
            if (response.ok) return response.json();
            else console.error(`Error al obtener los juegos en tendencias.`);
        })
        .then(games => {
            for (let game of games) {
                game.en_lista_de_deseos = wishList.findIndex(gameWish => gameWish.id_juego == game.id) != -1;
                wrapperItemsContainer.append(createGameItem(game));
            }

            imagesLoading();
        })
        .catch(error => console.error(error));
}

async function loginTest() {
    try {
        const credenciales = document.getElementById("login").value;

        const response = await fetch('/auth/login', { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                email: credenciales,
                contrasenia: "Prueba"
            })
        });

        const data = await response.json();

        if (response.ok) {
            localStorage.setItem('token_sesion', data.token);

            loadTrendingGames();

            console.log(localStorage.getItem('token_sesion'));
        } else console.error(data.message, data.contraseniaHash);

    } catch (error) { console.error(error) }
}

function createGameItem(game) {
    const gameContainer = document.createElement("div");
    gameContainer.classList.add("wrapper-item");
    gameContainer.id = game.id;
    
    const gameLink = document.createElement("a");
    gameLink.href = `/juego/${game.slug}`;

    
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
    
    const gameButtonFavorite = document.createElement("button");
    gameButtonFavorite.classList.add("button", "button-secondary", "favorite");
    const gameButtonFavoriteIcon = document.createElement("i");
    gameButtonFavoriteIcon.classList.add(game.en_lista_de_deseos ? iconInFavorite : iconFavorite);
    gameButtonFavorite.addEventListener("click", () => {
        const inWishList = gameButtonFavoriteIcon.classList.contains(iconInFavorite);
        toggleFavorite(game.id, inWishList);
        if (inWishList) gameButtonFavoriteIcon.className = iconFavorite;
        else gameButtonFavoriteIcon.className = iconInFavorite;
    });
    
    gameButtonFavorite.append(gameButtonFavoriteIcon);
    
    gameContainer.append(gameLink);
    gameContentContainer.append(gameType, gameTitle, gamePriceContainer);

    gameContainer.append(gameButtonFavorite);

    return gameContainer;
}

async function toggleFavorite(id, inWishList) {
    try {
        const token = localStorage.getItem('token_sesion');

        const action = inWishList ? "remove" : "add";

        const response = await fetch(`/api/usuarios/wishlist/${action}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id_juego: id
            })
        });

        const data = await response.json();

        if (response.ok) {
            console.log(`Se ha ${action == "add" ? "agregado" : "removido"} ${id} en tu lista de deseos.`);
        } else console.error(data.message);
    } catch (error) { console.error(error) }
}