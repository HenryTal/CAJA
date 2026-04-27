loadTrendingGames();

let iconFavorite = "ri-poker-hearts-line";
let iconInFavorite = "ri-poker-hearts-fill";

async function loadTrendingGames() {
    const section = document.querySelector(".trending");
    const wrapper = section.querySelector(".wrapper");
    const wrapperItemsContainer = wrapper.querySelector(".wrapper-items");

    const buttonTestLogin = document.getElementById("buttonLogin");
    buttonTestLogin.addEventListener("click", loginTest);

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
        toggleFavorite(game, inWishList);
        if (inWishList) gameButtonFavoriteIcon.className = iconFavorite;
        else gameButtonFavoriteIcon.className = iconInFavorite;
    });
    
    gameButtonFavorite.append(gameButtonFavoriteIcon);
    
    gameContainer.append(gameLink);
    gameContentContainer.append(gameType, gameTitle, gamePriceContainer);

    gameContainer.append(gameButtonFavorite);

    return gameContainer;
}

async function getWishListUser() {
    const token = localStorage.getItem('token_sesion');

    let wishList = [];
    
    const wishListResponse = await fetch(`/api/usuarios/wishlist/get`, { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

    if (wishListResponse.ok) wishList = await wishListResponse.json();

    return wishList;
}

async function toggleFavorite(game, inWishList) {
    try {
        const token = getToken();

        const action = inWishList ? "remove" : "add";

        const response = await fetch(`/api/usuarios/wishlist/${action}`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                id_juego: game.id
            })
        });

        const data = await response.json();

        if (response.ok) {
            createNotification("wishlist", "success", game.titulo, `Se ha ${action == "add" ? "agregado" : "removido"} en tu lista de deseos.`, `/image/games/${game.slug}/cover.jpg`);
            imagesLoading();
        } else {
            console.error(data.message);
        }
    } catch (error) { console.error(error) }
}

function createNotification(type, state, title, description, img) {
    const notificationWrapper = document.getElementById("notification-wrapper");

    const notificationContainer = document.createElement("div");
    notificationContainer.classList.add("notification", type, state);

    if (img) {
        const itemImage = document.createElement("div");
        itemImage.classList.add("item-image");

        const imgSource = document.createElement("img");
        imgSource.classList.add("image", "img-loading");
        imgSource.src = img;

        itemImage.append(imgSource);
        notificationContainer.append(itemImage);
    }

    const notificationContent = document.createElement("div");
    notificationContent.classList.add("item-content");
    
    const notificationTitle = document.createElement("span");
    notificationTitle.classList.add("subtitle");
    notificationTitle.textContent = title;
    
    const notificationDescription = document.createElement("span");
    notificationDescription.classList.add("description");
    notificationDescription.textContent = description;

    notificationContent.append(notificationTitle, notificationDescription);
    notificationContainer.append(notificationContent);

    notificationWrapper.append(notificationContainer);

    setTimeout(() => { notificationContainer.remove(); }, 5000);
}

function getToken() {
    return localStorage.getItem('token_sesion');
}