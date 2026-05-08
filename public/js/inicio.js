async function fillCarousel(carousel, games) {
    if (!games || !carousel) return;

    carousel = document.querySelector(carousel);
    const carouselItemsContainer = carousel.querySelector(".carousel-items");

    for (const game of games) {
        const containerItem = document.createElement("div");
        containerItem.classList.add("carousel-item");

        const imagesList = await getGameMedias(game.id);

        let sourceCover = await imagesList.filter(image => image.id_image.startsWith("ar"));
        sourceCover = sourceCover[sourceCover.length - 1];
        const sourceBackground = await imagesList.filter(image => !image.id_image.startsWith("ar"))[0];

        const imageBackgroundItem = document.createElement("img");
        imageBackgroundItem.classList.add("image", "img-loading");
        if (sourceBackground) imageBackgroundItem.src = `/image/medias/${sourceBackground.id_image}.jpg`;

        const containerInfoItem = document.createElement("div");
        containerInfoItem.classList.add("info");

        const containerCoverItem = document.createElement("div");
        containerCoverItem.classList.add("cover");
        const imageCoverItem = document.createElement("img");
        imageCoverItem.classList.add("image", "img-loading");
        if (sourceCover) imageCoverItem.src = `/image/games/${game.slug}/thumb.jpg`;
        containerCoverItem.append(imageCoverItem);

        const titleItem = document.createElement("h3");
        titleItem.classList.add("title");
        titleItem.textContent = game.titulo;

        const subtitleItem = document.createElement("h5");
        subtitleItem.classList.add("subtitle");
        subtitleItem.textContent = "Juego Base";

        const descriptionItem = document.createElement("p");
        descriptionItem.classList.add("descripcion");
        descriptionItem.textContent = game.descripcion;

        const priceItem = document.createElement("span");
        priceItem.classList.add("price");
        
        priceItem.innerHTML = getPrice(game.Tiendas).innerHTML;

        const buttonsItem = document.createElement("div");
        buttonsItem.classList.add("buttons");
        const buttonFavorite = document.createElement("button");
        buttonFavorite.classList.add("button", "button-secondary", "favorite");
        const buttonFavoriteIcon = document.createElement("i");
        buttonFavoriteIcon.classList.add(game.en_lista_de_deseos ? iconInFavorite : iconFavorite);
        buttonFavorite.addEventListener("click", async () => {
            const inWishList = buttonFavoriteIcon.classList.contains(iconInFavorite);
            
            const actionSuccessful = await toggleFavorite(game, inWishList);

            if (!actionSuccessful) return;

            if (!inWishList) buttonFavoriteIcon.className = iconInFavorite;
            else buttonFavoriteIcon.className = iconFavorite;
        });

        buttonFavorite.append(buttonFavoriteIcon);

        const buttonBuy = document.createElement("a");
        buttonBuy.classList.add("button", "button-primary", "buy");
        let shopIcon = document.createElement("i");

        const cheapShop = getCheapShop(game.Tiendas);

        if (!cheapShop) {
            buttonBuy.href = "#";
            shopIcon.classList.add(iconWithoutStock);
            buttonBuy.append(shopIcon, `No hay Stock de este Juego`);
        } else {
            buttonBuy.href = cheapShop.Juego_Tiendas.web;
            if (cheapShop.icon) shopIcon.classList.add("ca", cheapShop.icon);
            else {
                shopIcon = document.createElement("img");
                shopIcon.classList.add("image", "img-loading");
                shopIcon.src = `/image/stores/${cheapShop.id}/icon.png`;
            }

            buttonBuy.append(shopIcon, `Comprar en ${cheapShop.nombre}`);
        }

        buttonsItem.append(buttonFavorite, buttonBuy);

        containerInfoItem.append(containerCoverItem, titleItem, subtitleItem, descriptionItem, priceItem, buttonsItem);

        containerItem.append(imageBackgroundItem, containerInfoItem);

        carouselItemsContainer.append(containerItem);
    }

    carouselItemsContainer.children[0].classList.add("active");

    startCarousel();
    imagesLoading();
}