// Cuando la página termina de cargar llama al método loadFunctions
window.addEventListener("load", loadFunctions);

// Método que define lo necesario para el funcionamiento de los elementos dinamicos
// en la página web.
function loadFunctions() {
    // Botón para cambiar entre el tema oscuro y claro.
    const buttonChangeTheme = document.getElementById("changeTheme");
    // Sincroniza el icono con el tema seleccionado.
    syncTheme(buttonChangeTheme);
    // Agrega un evento para cambiar el tema seleccionado
    // cuando se haga clic en el botón.
    buttonChangeTheme.addEventListener("click", switchTheme);

    // Carga las imágenes de la página
    imagesLoading();
    
    loadWrappers();

    const menuUser = document.getElementById("dataUser");
    menuUser.addEventListener("click", toggleMenuUser);
}



// ╔══════════════════════════════════════════════════════════════════════╗
// ║                                                                      ║
// ║                       MISCELLANEOUS FUNCTIONS                        ║
// ║                                                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝

// Iconos que se usaran en algunas funciones del sitio.
// Clases para los iconos de la lista de deseos.
var iconFavorite = "ri-poker-hearts-line";
var iconInFavorite = "ri-poker-hearts-fill";
// Clases para los iconos de la lista de deseos.
var iconPurchased = "ri-add-circle-line";
var iconInPurchased = "ri-add-circle-fill";
// Clases para los iconos de tema oscuro y claro.
var iconThemeDark = "ri-moon-fill";
var iconThemeLight = "ri-sun-fill";
// Clases para los iconos de mostrar y ocultar contraseña.
var iconShowPassword = "ri-eye-close-line";
var iconHiddenPassword = "ri-eye-line";
// Clase para el icono de sin stock.
var iconWithoutStock = "ri-emotion-unhappy-line";



// Agregar espera entre líneas de código.
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Rellena la barra de carga cuando cambia de página.
 * @param {number} percent - Tamaño del relleno de la barra.
 * @returns 
 */
async function fillPageLoadBar(percent) {
    // Busca la barra de carga.
    const pageLoadBar = document.getElementById("pageLoadBar");
    // Busca el relleno en la barra de carga.
    const fillBar = pageLoadBar.querySelector(".fill");

    // Muestra la barra de carga.
    pageLoadBar.style.display = "block";
    // Cambian el tamaño del relleno.
    fillBar.style.width = `${percent}%`;
    
    // Si es el 100%.
    if (percent != 100) return;
    
    // Espera 500 milisegundos.
    await wait(500);
    
    // Oculta la barra de carga.
    pageLoadBar.style.display = "none";
    // Reinicia la barra de carga.
    fillBar.style.width = `0`;
}

// Agrega un evento para cuando el usuario hace clic en
// un elemento del página.
window.addEventListener("click", (e) => {
    // Si fue en un enlace o un elemento dentro de un enlace.
    const anchor = e.target.closest('a');
    
    // Comproba si el enlace es interno y no tiene atributos especiales.
    if (
        !(anchor && 
        anchor.tagName === 'A' && 
        anchor.host === window.location.host &&
        !anchor.getAttribute('download') &&
        anchor.target !== '_blank')
    ) return;
    
    // No recarga la página.
    e.preventDefault();
    
    // La URL en el enlace.
    const url = anchor.href.split(window.location.origin)[1];

    changePage(url, true);
});


// Agrega un evento para cuando el usuario navega por el
// historial.
window.addEventListener("popstate", async () => {
    // La página de destino.
    const destinationURL = window.location.pathname;

    changePage(destinationURL, false);
});

window.addEventListener("offline", () => { notifyUser("connection", "failed", "No tienes conexión a internet"); });
window.addEventListener("online", () => { notifyUser("connection", "success", "Vuelves a tener conexión a internet"); });

function notifyUser(type, state, message) {
    let container = document.querySelector("#statusConnection");
    container.className = `show ${state}`;

    const messageContainer = container.querySelector(".message");
    messageContainer.textContent = message;

    if (state == "success") setTimeout(() => { container.classList.remove("show", "success") }, 5000);
}

async function toggleMenuUser() {
    const menuUser = document.getElementById("dataUser").querySelector(".settings");
    menuUser.innerHTML = "";
    menuUser.classList.toggle("show");

    const menuElements = [];

    menuElements.push(createElementMenu("settings", "link", "ri-settings-5-line", "Configuración", "/settings"));
    menuElements.push(createElementMenu("settings", "split"));

    const isRegistered = getToken();
    
    if (isRegistered) {
        const infoUser = await getInfoUser();

        menuElements.unshift(
            createElementMenu("settings", "link", "ri-user-line", "Perfil", `/usuario/${infoUser.nombre_usuario}`),
            createElementMenu("settings", "link", "ri-book-shelf-line", "Biblioteca", "/library"),
            createElementMenu("settings", "link", "ri-heart-line", "Lista de Deseos", "/wishlist")
        );

        menuElements.push(createElementMenu("settings", "link", "ri-logout-box-line", "Cerrar Sesión", "/auth/logout"));
    } else {
        menuElements.push(
            createElementMenu("settings", "link", "ri-login-box-line", "Iniciar Sesión", "/auth/login"),
            createElementMenu("settings", "link", "ri-user-add-line", "Registrarse", "/auth/register")
        );
    }

    menuElements.forEach((element) => {
        menuUser.append(element);
    });
}

/**
 * Crea un Elemento para el menu con los parametros que se le indiquen.
 * @param {String} menu - El nombre del menu.
 * @param {"split" | "link"} type - El tipo de elemento.
 * @param {String} icon - La clase del icono para el elemento.
 * @param {String} legend - El texto que tendra el elemento.
 * @param {URL} url - La URL si el elemento es de tipo "link".
 * @returns {HTMLLIElement} - Elemento para el menu.
 */
function createElementMenu(menu, type, icon, legend, url) {
    const elementMenu = document.createElement("li");
    elementMenu.className = `item-${menu}`;

    if (type == "split") {
        elementMenu.className = `split-${menu}`;
    }
    
    if (type == "link") {
        const elementLink = document.createElement("a");
        elementLink.classList.add("link");
        elementLink.href = url;
        
        const elementIcon = document.createElement("i");
        elementIcon.classList.add(icon);
        
        elementLink.append(elementIcon, legend);
        
        elementMenu.append(elementLink);
    }

    return elementMenu;
}



// ╔══════════════════════════════════════════════════════════════════════╗
// ║                                                                      ║
// ║                        SWITCH THEME FUNCTIONS                        ║
// ║                                                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝

/**
 * Método que sincroniza el icono a mostrar en el botón que cambia entre
 * el tema oscuro y claro.
 * @param {HTMLElement} button - Elemento que actua como boton/icono del
 * tema actual.
 */
function syncTheme(button) {
    // El tema seleccionado desde un atributo de <body>.
    const selectedTheme = document.body.getAttribute("theme");
    // Icono en el botón.
    const icon = button.querySelector("i");

    // Si el tema seleccionado es "dark" cambia el icono para el tema oscuro.
    if (selectedTheme == "dark") icon.setAttribute("class", iconThemeDark);
    // Si el tema seleccionado es "light" cambia el icono para el tema claro.
    else if (selectedTheme == "light") icon.setAttribute("class", iconThemeLight);
}

// Método para cambiar el tema de la página web.
function switchTheme() {
    // El tema seleccionado desde un atributo de <body>.
    const selectedTheme = document.body.getAttribute("theme");
    // Botón para cambiar el tema.
    const button = document.querySelector("#changeTheme");
    
    // Si el tema seleccionado era "dark" lo cambia a "light".
    if (selectedTheme == "dark") document.body.setAttribute("theme", "light");
    // Si el tema seleccionado era "light" lo cambia a "dark".
    else if (selectedTheme == "light") document.body.setAttribute("theme", "dark");

    // Llama al método "syncTheme" para sincronizar el icono del botón.
    syncTheme(button);
}



// ╔══════════════════════════════════════════════════════════════════════╗
// ║                                                                      ║
// ║                       IMAGES FUNCTIONS LOADING                       ║
// ║                                                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝

// Método que gestiona la carga de las imágenes en la página.
function imagesLoading() {
    // Todas las imágenes cargando actualmente en la página.
    const images = document.querySelectorAll('.img-loading');

    // Por cada imagen cargando.
    images.forEach(img => {
        // Agrega un evento para mostrar la imagen en la página 
        // cuando la imagen ya ha cargado.
        img.addEventListener("load", () => showImage(img));
        // Agrega un evento para quitar la imagen de la página
        // cuando ha ocurrido un error al cargar la imagen.
        img.addEventListener("error", () => errorImage(img));
    
        // Si la imagen ya habia cargado antes de ejecutar el
        // script lo gestiona de otra manera.
        if (!img.complete) return;

        // Si la imagen tiene un ancho superior a 0, es decir,
        // la imagen pudo cargar correctamente la muestra en 
        // la página.
        if (img.naturalWidth > 0) showImage(img);
        // De lo contrario si es 0, es porque ha ocurrido un
        // error al cargar la imagen y la oculta en la página.
        else if (img.naturalWidth === 0) errorImage(img);
    });
}

/**
 * Muestra la imagen en la página cuando ha cargado correctamente.
 * @param {HTMLImageElement} img - La imagen que sera mostrada
 */
function showImage(img) {
    img.classList.add('img-loaded');
    setTimeout(() => {img.classList.remove('img-loading');}, 100);
}

/**
 * Oculta la imagen en la página cuando da error.
 * @param {HTMLImageElement} img - La imagen que sera ocultada
 */
function errorImage(img) {
    img.classList.add('img-error');
    img.classList.remove('img-loading');
}



// ╔════════════════════════════════════════════════════════════════════╗
// ║                                                                    ║
// ║                  SPA NAVIGATION INTERCEPTOR                        ║
// ║                                                                    ║
// ╚════════════════════════════════════════════════════════════════════╝

/**
 * Obtiene el HTML de la página que se busca.
 * @param {string} url - URL de la página que quiere obtener.
 * @returns {Promise<Document | void>} - Página.
 */
async function navigateTo(url) {
    // Rellena un 75% la barra de carga de la página.
    fillPageLoadBar(75);

    try {
        // Envía una petición fetch a la página.
        const response = await fetch(url);

        // Si ha ocurrido un Error en la petición lo envía el código de error.
        if (!response.ok) throw new Error(`HTTP error! status: ${response.status}`);

        // El HTML en texto de la página.
        const htmlPage = await response.text();
        
        // Convertidor a DOM.
        const parser = new DOMParser();
        // Convierte el texto obtenido de la página a DOM.
        const newPage = parser.parseFromString(htmlPage, 'text/html');
        
        // Rellena por completo la barra de carga de la página.
        fillPageLoadBar(100);
    
        // Devuelve la página obtenida.
        return newPage;
    } catch(error) {
        if (!navigator.onLine) {
            console.error("El usuario no tiene conexión a internet");
        } else {
            // Si encontro un error lo envía por consola.
            console.error("No se ha podido conectar con el servidor: ", error);
            createNotification("normal", "failed", "Problemas al Navegar", "No se ha podido conectar con el Servidor.");
        }
        
        // Rellena por completo la barra de carga de la página.
        fillPageLoadBar(100);
    }
}

/**
 * Cambiar el contenido de un elemento en concreto.
 * @param {string} url - URL de la página que quiere buscar contenido.
 * @param {string} containerID - ID del elemento al que se le quiere
 * cambiar el contenido.
 * @param {string} searchContainerID - ID del elemento que se busca
 * en la nueva página.
 * @param {boolean} addToHistory - Si se quiere agregar al historial.
 * @returns 
 */
async function changeContent(url, containerID, searchContainerID, addToHistory) {
    // Busca la página.
    const page = await navigateTo(url);

    // Si no ha recibido nada es porque no se ha encontrado
    // o hubo un error asi que detiene la ejecución.
    if (!page) return;
    
    // Si debe agregarla al historial lo agrega.
    if (addToHistory) window.history.pushState({}, page.title, url);

    let newStyles = Array.from(page.querySelectorAll('link[rel="stylesheet"]'));
    let oldStyles = Array.from(document.querySelectorAll('link[rel="stylesheet"]'));
    oldStyles = oldStyles;
    
    stylesToLoad = newStyles.filter(newStyle => !oldStyles.some(oldStyle => oldStyle.href === newStyle.href));
    
    let newScripts = Array.from(page.querySelectorAll("script"));
    let oldScripts = Array.from(document.querySelectorAll("script"));

    oldScripts.forEach(script => script.remove());
    
    // scriptsToLoad = newScripts.filter(newScript => !oldScripts.some(oldScript => oldScript.src === newScript.src));

    stylesToLoad.forEach(style => {
        document.head.appendChild(style);
    });
    newScripts.forEach(script => {
        const newScript = document.createElement("script");
        newScript.src = script.src;

        newScript.onload = () => {
            // if (typeof startCarousel === "function") {
            //     startCarousel();
            // }
            // if (typeof loadFunctions === "function") {
            //     loadFunctions();
            // }
            // if (typeof loadTrendingGames === "function") {
            //     loadTrendingGames();
            // }
            // if (typeof loadLoginFunctions === "function") {
            //     loadLoginFunctions();
            // }
            // if (typeof loadUserDetails === "function") {
            //     // loadUserDetails();
            // }
        }

        document.body.appendChild(newScript);
    });
    
    // Busca el elemento que se va a cambiar.
    const oldContent = document.getElementById(containerID);
    // Busca el elemento que se buscaba en la página.
    const newContent = page.getElementById(searchContainerID);
    
    // Cambia el contenido por el encontrado en la página.
    oldContent.innerHTML = newContent.innerHTML;

    // Cargar las funciones a los elementos que deberian tener.
    loadFunctions();
}

function changePage(url, addToHistory) {
    // Los casos de posibles páginas a las que quiere ir el usuario.
    if (url == "/") navigateToHome(addToHistory); // Lleva a la página Inicio.
    else if (url.split("#").length != 1) {
        console.log(url);

        let elementID = url.split("#");
        elementID = elementID[elementID.length - 1];

        scrollToElement(elementID);
    }
    else if (url == "/test") testNavigation(addToHistory); // Lleva a la página test.
    else if (url == "/auth/logout") logOut();
    else if (url.startsWith("/juego/")) {
        const slug = url.split("/")[2];
        console.log("Mostrando Juego", slug);

        const mainGame = document.getElementById("main-game");

        if (mainGame.innerHTML == "") changeContent(url, "main-game", "main", true);
    }
    else changeContent(url, "main", "main", addToHistory);
}

function scrollToElement(id) {
    const element = document.getElementById(id);

    if (!element) return;

    const navbar = document.querySelector(".navbar");
    const navbarHeight = navbar.offsetHeight;

    element.style.scrollMarginTop = `${navbarHeight}px`;

    element.scrollIntoView({ behavior: "smooth", block: "start" })
}

/**
 * Lleva al usuario a la página test.
 * @param {boolean} addToHistory - Si debe agregar la página al historial
 * para evitar un bucle infinito agregando la misma página.
 */
function testNavigation(addToHistory) {
    changeContent("/test", "containerTest", "test", addToHistory);
}

// Lleva al usuario a la página inicio.
function navigateToHome(addToHistory) {
    changeContent("/", "main", "main", addToHistory);
}



// ╔══════════════════════════════════════════════════════════════════════╗
// ║                                                                      ║
// ║                        WRAPPER WITH CONTROLS                         ║
// ║                                                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝

// Método para cargar todas las funciones de los wrappers con controles.
function loadWrappers() {
    // Busca todos los wrapper que tengan la clase "controls".
    const wrappersWithControls = document.querySelectorAll('.wrapper.controls');

    // Por cada uno de los encontrados.
    wrappersWithControls.forEach(wrapper => {
        // Busca su botón "anterior".
        const buttonPrev = wrapper.querySelector(".button-prev");
        // Agrega un evento para cuando el usuario haga clic en el.
        buttonPrev.addEventListener("click", () => { moveWrapperItems(wrapper, "prev") });
        
        // Busca su botón "siguiente".
        const buttonNext = wrapper.querySelector(".button-next");
        // Agrega un evento para cuando el usuario haga clic en el.
        buttonNext.addEventListener("click", () => { moveWrapperItems(wrapper, "next") });

        // Aplica los descuentos a los juegos dentro del wrapper.
        applyDiscounts(wrapper);
        // Actualiza los botones del wrapper.
        moveWrapperItems(wrapper);
    });
}

/**
 * Aplica los descuentos a los precios de los juegos.
 * @param {HTMLDivElement} wrapper - El wrapper en el que se buscaran precios.
 */
function applyDiscounts(wrapper) {
    // Busca todos los precios en el contenedor.
    const prices = wrapper.querySelectorAll(".price");

    // Por cada uno de ellos.
    prices.forEach(price => {
        // Busca el descuento.
        let offer = price.querySelector(".offer")
        
        // Si no tiene termina la ejecución.
        if (!offer) return;

        // Define de cuanto es el descuento.
        offer = offer.textContent;
        // Busca el precio base.
        const priceBase = price.querySelector(".base").textContent;

        // Aplica el descuento al precio.
        const discount = (offer * priceBase) / 100;
        // Deja solo 2 decimales.
        const priceWithOffer = Math.trunc((priceBase - discount) * 100) / 100;

        // Crea un elemento <span>.
        const priceWithOfferContainer = document.createElement("span");
        // Le agrega la clase "now".
        priceWithOfferContainer.classList.add("now");
        // Agrega el precio con descuento.
        priceWithOfferContainer.textContent = priceWithOffer;

        // Lo agrega al precio para ser mostrado.
        price.append(priceWithOfferContainer);
    })
}

function getDiscounts(priceNow, priceBase) {
    const priceContainer = document.createElement("span");
    const priceBaseContainer = document.createElement("span");
    priceBaseContainer.classList.add("base");
    priceBaseContainer.textContent = priceBase;
    
    if (priceNow != priceBase) {
        const priceNowContainer = document.createElement("span");
        priceNowContainer.classList.add("now");
        priceNowContainer.textContent = priceNow;

        const priceOfferContainer = document.createElement("span");
        priceOfferContainer.classList.add("offer");
        priceOfferContainer.textContent = Math.round((priceBase * priceNow) / 100);

        priceContainer.append(priceOfferContainer, priceBaseContainer, priceNowContainer);
    } else priceContainer.append(priceBaseContainer);

    return priceContainer;
}

function getPrice(tiendas) {
    if (!tiendas) {
        const priceContainer = document.createElement("span");
        const priceBase = document.createElement("span");
        priceBase.classList.add("base");
        priceBase.textContent = 0;
        priceContainer.append(priceBase);

        return priceContainer;
    }
    
    const cheapShop = getCheapShop(tiendas);
    
    return getDiscounts(cheapShop.Juego_Tiendas.precio_actual, cheapShop.Juego_Tiendas.precio_base);
}

function getCheapShop(tiendas) {
    tiendas.sort((a, b) => a.Juego_Tiendas.precio_actual - b.Juego_Tiendas.precio_actual);
    
    return tiendas[0];
}

async function getGameMedias(gameID) {
    try {
        const response = await fetch(`/api/juegos/${gameID}/medias`)
                                .then(response => {
                                    if (response.ok) return response.json();
                                    else console.error(`Error al obtener las imagenes del juego con ID (${gameID}).`);
                                })

        return response;
    } catch (error) {
        console.log("Error al buscar imagenes: ", error);
    }
}

/**
 * Mover los elementos de un wrapper.
 * @param {HTMLDivElement} wrapper - El wrapper al que se le moveran los elementos.
 * @param {String} direction - La dirección a la que sera movido.
 * @returns
 */
function moveWrapperItems(wrapper, direction) {
    // El inidice actual de el wrapper.
    let indexWrapper = wrapper.getAttribute("data-index");
    // Si se ha indicado una dirección aumenta o disminuye el indice.
    if (direction != null) indexWrapper = direction == "prev" ? parseInt(indexWrapper) - 1 : parseInt(indexWrapper) + 1;

    // Si el indice ahora es negativo lo pasa a 0
    // y termina la ejecución.
    if (indexWrapper < 0) {
        indexWrapper = 0;
        return;
    }
    
    // El ancho de el wrapper.
    const widthWrapper = wrapper.clientWidth;
    // Los elementos dentro de el wrapper.
    const wrapperItems = wrapper.querySelector(".wrapper-items");

    if (wrapperItems.children.length == 0) {
        wrapper.classList.add("start", "end");
        return;
    }

    // El ancho de un elemento en el wrapper.
    const widthItem = wrapperItems.children[0].clientWidth;
    
    // Calcula cuantos elementos se muestran por página
    // usando el ancho del wrapper y el de un elemento.
    const itemsPerPage = Math.floor(widthWrapper / widthItem);
    // Calcula cuanta separación hay entre cada elemento de el wrapper
    // restando el espacio sobrante de el ancho de el wrapper y
    // el ancho sumado de todos los elementos de una página.
    const gapItems = Math.floor((widthWrapper - (widthItem * itemsPerPage)) / (itemsPerPage - 1));

    // Calcula la cantidad de páginas que se necesitan.
    const numberPages = (wrapperItems.children.length / itemsPerPage);

    // Si el indice actual es mayor al numero de páginas detiene
    // la ejecución.
    if (indexWrapper > numberPages) {
        indexWrapper = numberPages;
        return;
    }

    // Cuanto debe desplazar los elementos para mostrar la siguiente página.
    let newPage = ((gapItems + widthWrapper) * indexWrapper);

    // Calcula cuanto es el desplazamiento que habria si la última página no tiene
    // los elementos suficientes para rellenar el wrapper.
    const missingWidth = ((numberPages - 1) * widthWrapper) + ((numberPages - 1) * gapItems);

    // Si el desplazamiento es mayor al espacio anterior en lugar de mostrar el
    // espacio vacio simplemento lo establece.
    if (newPage > missingWidth) newPage = missingWidth;

    // Cambia el indice en el wrapper.
    wrapper.setAttribute("data-index", indexWrapper);

    // Si solo hay una página agrega estas clases para desactivar
    // visualmente los botones.
    if (numberPages == 1) {
        wrapper.classList.add("start", "end");
    } else if (indexWrapper == Math.floor(numberPages)) {
        // Si el indice es igual a la cantidad de páginas desactiva
        // visualmente el boton "siguiente".
        wrapper.classList.add("end");
        wrapper.classList.remove("start");
    } else if (indexWrapper == 0) {
        // Si el indice es igual a 0 desactiva visualmente el boton "anterior".
        wrapper.classList.add("start");
        wrapper.classList.remove("end");
    } else {
        // Si el indice no es ninguno de los casos anteriores activa
        // visualmente ambos botones.
        wrapper.classList.remove("start", "end");
    }

    // Desplaza los elementos.
    wrapperItems.style.left = `-${newPage}px`;
}

function logOut() {
    localStorage.removeItem("token_sesion");

    createNotification("normal", "success", "Cerrar Sesión", "Esperamos verte pronto...");
}



///////////////////

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
    
    const gamePriceContainer = getPrice(game.Tiendas);
    gamePriceContainer.classList.add("price");

    const gameButtons = document.createElement("div");
    gameButtons.classList.add("buttons");
    
    const gameButtonPurchased = document.createElement("button");
    gameButtonPurchased.classList.add("button", "button-secondary", "purchased");
    const gameButtonPurchasedIcon = document.createElement("i");
    gameButtonPurchasedIcon.classList.add(game.lo_tiene ? iconInPurchased : iconPurchased);
    gameButtonPurchased.addEventListener("click", async () => {
        const inPurchasedList = gameButtonPurchasedIcon.classList.contains(iconInPurchased);
        
        const actionSuccessful = await togglePurchased(game, inPurchasedList);

        if (!actionSuccessful) return;

        if (!inPurchasedList) gameButtonPurchasedIcon.className = iconInPurchased;
        else gameButtonPurchasedIcon.className = iconPurchased;
    });
    
    gameButtonPurchased.append(gameButtonPurchasedIcon);
    
    const gameButtonFavorite = document.createElement("button");
    gameButtonFavorite.classList.add("button", "button-secondary", "favorite");
    const gameButtonFavoriteIcon = document.createElement("i");
    gameButtonFavoriteIcon.classList.add(game.en_lista_de_deseos ? iconInFavorite : iconFavorite);
    gameButtonFavorite.addEventListener("click", async () => {
        const inWishList = gameButtonFavoriteIcon.classList.contains(iconInFavorite);
        
        const actionSuccessful = await toggleFavorite(game, inWishList);

        if (!actionSuccessful) return;

        if (!inWishList) gameButtonFavoriteIcon.className = iconInFavorite;
        else gameButtonFavoriteIcon.className = iconFavorite;
    });
    
    gameButtonFavorite.append(gameButtonFavoriteIcon);

    gameButtons.append(gameButtonFavorite, gameButtonPurchased);
    
    gameContainer.append(gameLink);
    gameContentContainer.append(gameType, gameTitle, gamePriceContainer);

    gameContainer.append(gameButtons);

    return gameContainer;
}

async function getWishListUser() {
    const token = getToken();

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

async function getPurchasedListUser() {
    const token = getToken();

    let purchasedList = [];
    
    const purchasedListResponse = await fetch(`/api/usuarios/purchased/get`, { 
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': `Bearer ${token}`
                        }
                    });

    if (purchasedListResponse.ok) purchasedList = await purchasedListResponse.json();

    return purchasedList;
}

async function togglePurchased(game, inPurchasedList) {
    try {
        const token = getToken();

        const action = inPurchasedList ? "remove" : "add";

        const response = await fetch(`/api/usuarios/purchased/${action}`, { 
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
            createNotification("purchasedlist", "success", game.titulo, `Se ha ${action == "add" ? "agregado ha" : "removido de"} tu lista de juegos comprados.`, `/image/games/${game.slug}/cover.jpg`);
            imagesLoading();

            return true;
        } else {
            console.error(data.message);
            createNotification("normal", "failed", "Agregar Juego a Lista de Juegos Comprados", `No se ha podido ${action == "add" ? "agregar" : "remover"} en tu Lista de Juegos Comprados.`);

            return false;
        }
    } catch (error) { 
        console.error(error);
        createNotification("normal", "failed", "Agregar Juego a Lista de Juegos Comprados", `No se ha podido agregar a tu Lista de Juegos Comprados.`);
        
        return false;
    }
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
            createNotification("wishlist", "success", game.titulo, `Se ha ${action == "add" ? "agregado ha" : "removido de"} tu lista de deseos.`, `/image/games/${game.slug}/cover.jpg`);
            imagesLoading();

            return true;
        } else {
            console.error(data.message);
            createNotification("normal", "failed", "Agregar Juego a Lista de Deseos", `No se ha podido ${action == "add" ? "agregar" : "remover"} en tu Lista de Deseos.`);

            return false;
        }
    } catch (error) { 
        console.error(error);
        createNotification("normal", "failed", "Agregar Juego a Lista de Deseos", `No se ha podido agregar a tu Lista de Deseos.`);
        
        return false;
    }
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

async function loadGamesInWrapper(sectionClass, gamesList, counter = false) {
    const section = document.querySelector(sectionClass);

    if (!section) return;

    if (counter) {
        const sectionTitle = section.querySelector(".section-title");
        if (sectionTitle.textContent.split("(").length == 1) sectionTitle.textContent += ` (${gamesList.length})`;
    }

    const wrapper = section.querySelector(".wrapper");
    const wrapperItemsContainer = wrapper.querySelector(".wrapper-items");

    const wishListViewer = await getWishListUser();
    const purchasedListViewer = await getPurchasedListUser();

    wrapperItemsContainer.innerHTML = "";

    if (!gamesList || !gamesList[0]) {
        wrapperItemsContainer.append(gamesNotFound());
    } else {
        for (let game of gamesList) {
            game.en_lista_de_deseos = wishListViewer.findIndex(gameWish => gameWish.id_juego == game.id) != -1;
            game.lo_tiene = purchasedListViewer.findIndex(gamePurchased => gamePurchased.id_juego == game.id) != -1;
            wrapperItemsContainer.append(createGameItem(game));
        }
    
        moveWrapperItems(wrapper);
    }
            
    imagesLoading();
}

function gamesNotFound() {
    const itemContainer = document.createElement("div");
    itemContainer.classList.add("item", "notFound");

    const itemImage = document.createElement("div");
    itemImage.classList.add("item-image", "transparent");

    const itemImageSource = document.createElement("img");
    itemImageSource.classList.add("image", "img-loading");
    itemImageSource.src = "/img/not-found-full-art-v2.png";

    itemImage.append(itemImageSource);

    const itemContent = document.createElement("div");
    itemContent.classList.add("item-content");

    const itemText = document.createElement("h3");
    itemText.classList.add("title");
    itemText.textContent = "No se ha encontrado nada en esta caja...";

    itemContent.append(itemText);

    itemContainer.append(itemImage, itemContent);

    return itemContainer;
}

async function getInfoUser() {
    try {
        const token = getToken();

        const response = await fetch(`/api/usuarios/info`, { 
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        });

        
        if (response.ok) {
            const data = await response.json();
            return data;
        } else {
            return [];
        }
    } catch (error) { 
        console.error(error);
        return [];
    }
}