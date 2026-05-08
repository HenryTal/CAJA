loadGameDetails();

let gameData;

let allShops;
let imagesList;

let sourceThumb;
let sourceBackground;

async function loadGameDetails() {
    try {
        let wishList = [];
        let gamesPurchased = [];

        const slug = location.href.split("/juego/")[1].split("/")[0];

        const response = await fetch(`/api/juegos/${slug}`);
        const infoViewer = await getInfoUser();

        const game = await response.json();
        gameData = game;
        allShops = game.Tiendas;

        imagesList = await getGameMedias(game.id);

        sourceThumb = await imagesList.filter(image => image.id_image.startsWith("ar"));
        sourceThumb = sourceThumb[sourceThumb.length - 1];
        sourceBackground = await imagesList.filter(image => !image.id_image.startsWith("ar"))[0];

        if (response.ok) {
            const detailsContainer = document.querySelector(".section.details");

            const coverContainer = detailsContainer.querySelector(".cover");
            const coverSource = document.createElement("img");
            coverSource.classList.add("image", "img-loading");
            coverSource.src = `/image/games/${game.slug}/cover.jpg`;
            coverContainer.append(coverSource);

            const backgroundContainer = detailsContainer.querySelector(".background");
            const backgroundSource = document.createElement("img");
            backgroundSource.classList.add("image", "img-loading");
            backgroundSource.src = `/image/medias/${sourceBackground.id_image}.jpg`;
            backgroundContainer.append(backgroundSource);

            const titleContainer = detailsContainer.querySelector(".title");
            titleContainer.textContent = game.titulo;

            const platformsWrapper = detailsContainer.querySelector(".wrapper.platforms");
            const platformsWrapperItems = platformsWrapper.querySelector(".wrapper-items");
            platformsWrapperItems.innerHTML = "";
            for (let platform of game.Plataformas) {
                const plataformItem = document.createElement("h4");
                plataformItem.classList.add("wrapper-item", `platform-${platform.id}`);
                
                const platformItemIcon = document.createElement("i");
                platformItemIcon.classList.add(platform.icon);
                
                plataformItem.append(platformItemIcon, platform.nombre);
                platformsWrapperItems.append(plataformItem);
            }

            const priceContainer = detailsContainer.querySelector(".price");
            priceContainer.innerHTML = getPrice(game.Tiendas).innerHTML;

            const favoriteButton = detailsContainer.querySelector(".button.favorite");
            const favoriteButtonIcon = document.createElement("i");
            favoriteButtonIcon.classList.add(iconFavorite);
            favoriteButton.append(favoriteButtonIcon);
            favoriteButton.addEventListener("click", async () => {
                const inWishList = favoriteButtonIcon.classList.contains(iconInFavorite);
        
                const actionSuccessful = await toggleFavorite(game, inWishList);

                if (!actionSuccessful) return;

                if (!inWishList) favoriteButtonIcon.className = iconInFavorite;
                else favoriteButtonIcon.className = iconFavorite;
            });

            const cheapShop = getCheapShop(game.Tiendas);

            const buyButton = detailsContainer.querySelector(".button.buy");
            const otherShops = detailsContainer.querySelector(".others");
            let shopIcon = document.createElement("i");

            if (!cheapShop) {
                buyButton.href = "#";
                shopIcon.classList.add(iconWithoutStock);
                buyButton.append(shopIcon, `No hay Stock de este Juego`);
            } else {
                buyButton.href = cheapShop.Juego_Tiendas.web;
                if (cheapShop.icon) shopIcon.classList.add("ca", cheapShop.icon);
                else {
                    shopIcon = document.createElement("img");
                    shopIcon.classList.add("image", "img-loading");
                    shopIcon.src = `/image/stores/${cheapShop.id}/icon.png`;
                }

                buyButton.append(shopIcon, `Comprar en ${cheapShop.nombre}`);
    
                otherShops.textContent = `Ver precios en otras ${game.Tiendas.length} tiendas`;
            }

            const descriptionContainer = detailsContainer.querySelector(".description");
            descriptionContainer.textContent = game.descripcion;

            getOtherShops();

            imagesLoading();
            detailsContainer.classList.remove("loading");
        } else {
            createNotification("normal", "failed", "Perfil de Usuario", "Usuario no Encontrado");
        }
    } catch (error) { console.error(error) }
}

function getOtherShops() {
    try {
        const containerShops = document.querySelector(".others-shops");

        if (allShops.length == 0) {
            containerShops.append(gamesNotFound());
            return;
        }

        for (const shop of allShops) {
            const shopItem = document.createElement("div");
            shopItem.classList.add("shop-item");

            const shopLogo = document.createElement("div");
            shopLogo.classList.add("item-image", "transparent");
            const shopSourceLogo = document.createElement("img");
            shopSourceLogo.classList.add("image", "img-loading");
            shopSourceLogo.src = shop.logo;

            shopLogo.append(shopSourceLogo);

            const shopNombre = document.createElement("h3");
            shopNombre.classList.add("title");
            shopNombre.textContent = shop.nombre;

            const shopPrice = getDiscounts(shop.Juego_Tiendas.precio_actual, shop.Juego_Tiendas.precio_base);
            shopPrice.classList.add("price");

            const shopLink = document.createElement("a");
            shopLink.href = shop.Juego_Tiendas.web;

            shopItem.append(shopLogo, shopNombre, shopPrice, shopLink);
            containerShops.append(shopItem);
        }
    } catch (error) {
        console.error(error);
    }
}