loadGameDetails();

function getGameThumb(imagesList) {
    let sourceThumb = imagesList.filter(image => image.id_image.startsWith("ar"));
    sourceThumb = sourceThumb[sourceThumb.length - 1];

    return sourceThumb;
}

function getGameBackground(imagesList) {
    let sourceBackground = imagesList.filter(image => !image.id_image.startsWith("ar"))[0];

    return sourceBackground;
}

async function loadGameDetails() {
    try {
        const slug = location.href.split("/juego/")[1].split("/")[0];
        
        const response = await fetch(`/api/juegos/${slug}`);
        const infoViewer = await getInfoUser();
        
        const game = await response.json();
        let gameData = game;
        let allShops = game.Tiendas;
        
        let wishListViewer = await getWishListUser();
        let purchasedListViewer = await getPurchasedListUser();

        game.en_lista_de_deseos = wishListViewer.findIndex(gameWish => gameWish.id_juego == game.id) != -1;
        game.lo_tiene = purchasedListViewer.findIndex(gamePurchased => gamePurchased.id_juego == game.id) != -1;

        imagesList = await getGameMedias(game.id);

        let sourceThumb = getGameThumb(imagesList);
        let sourceBackground = getGameBackground(imagesList);

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
            favoriteButtonIcon.classList.add(game.en_lista_de_deseos ? iconInFavorite : iconFavorite);
            favoriteButton.append(favoriteButtonIcon);
            favoriteButton.addEventListener("click", async () => {
                const inWishList = favoriteButtonIcon.classList.contains(iconInFavorite);
        
                const actionSuccessful = await toggleFavorite(game, inWishList);

                if (!actionSuccessful) return;

                if (!inWishList) favoriteButtonIcon.className = iconInFavorite;
                else favoriteButtonIcon.className = iconFavorite;
            });
            
            const purchasedButton = detailsContainer.querySelector(".button.purchased");
            const purchasedButtonIcon = document.createElement("i");
            purchasedButtonIcon.classList.add(game.lo_tiene ? iconInPurchased : iconPurchased);
            purchasedButton.append(purchasedButtonIcon);
            purchasedButton.addEventListener("click", async () => {
                const inPurchasedList = purchasedButtonIcon.classList.contains(iconInPurchased);
        
                const actionSuccessful = await togglePurchased(game, inPurchasedList);

                if (!actionSuccessful) return;

                if (!inPurchasedList) purchasedButtonIcon.className = iconInPurchased;
                else purchasedButtonIcon.className = iconPurchased;
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

            getOtherShops(allShops);

            imagesLoading();
            detailsContainer.classList.remove("loading");
        } else {
            createNotification("normal", "failed", "Perfil de Usuario", "Usuario no Encontrado");
        }
    } catch (error) { console.error(error) }
}

function getOtherShops(allShops) {
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