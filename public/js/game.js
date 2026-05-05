loadGameDetails();

async function loadGameDetails() {
    try {
        let wishList = [];
        let gamesPurchased = [];

        const slug = location.href.split("/juego/")[1].split("/")[0];

        const response = await fetch(`/api/juegos/${slug}`);
        const infoViewer = await getInfoUser();

        const game = await response.json();

        if (response.ok) {
            const detailsContainer = document.querySelector(".section.details");

            const coverContainer = detailsContainer.querySelector(".cover");
            const coverSource = document.createElement("img");
            coverSource.classList.add("image", "img-loading");
            coverSource.src = `/image/games/${game.slug}/cover.jpg`;
            coverContainer.append(coverSource);

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

            imagesLoading();

            detailsContainer.classList.remove("loading");
        } else {
            createNotification("normal", "failed", "Perfil de Usuario", "Usuario no Encontrado");
        }
    } catch (error) { console.error(error) }
}