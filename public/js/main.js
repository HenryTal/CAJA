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
    
    startCarousel();

    loadWrappers();

    const buttonTestSPA = document.getElementById("testSPA");
    if (buttonTestSPA) buttonTestSPA.addEventListener("click", () => testNavigation(true));
}



// ╔══════════════════════════════════════════════════════════════════════╗
// ║                                                                      ║
// ║                       MISCELLANEOUS FUNCTIONS                        ║
// ║                                                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝

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
    
    // Si la URL destino es la página de Inicio.
    if (url == "/") navigateToHome(true);
})    


// Agrega un evento para cuando el usuario navega por el
// historial.
window.addEventListener("popstate", async () => {
    // La página de destino.
    const destinationURL = window.location.pathname;

    // Los casos de posibles páginas a las que quiere ir el usuario.
    switch (destinationURL) {
        case "/":
            // Lleva a la página Inicio.
            navigateToHome();
            break;
    
        case "/test":
            // Lleva a la página test.
            testNavigation(false);
            break;

        default:
            break;
    }
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



// ╔══════════════════════════════════════════════════════════════════════╗
// ║                                                                      ║
// ║                        SWITCH THEME FUNCTIONS                        ║
// ║                                                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝

// Clases para los iconos de tema oscuro y claro.
let iconThemeDark = "ri-moon-fill";
let iconThemeLight = "ri-sun-fill";

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
    img.classList.remove('img-loading');
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
    
    // Busca el elemento que se va a cambiar.
    const oldContent = document.getElementById(containerID);
    // Busca el elemento que se buscaba en la página.
    const newContent = page.getElementById(searchContainerID);
    
    // Cambia el contenido por el encontrado en la página.
    oldContent.innerHTML = newContent.innerHTML;

    // Cargar las funciones a los elementos que deberian tener.
    loadFunctions();
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

function loadWrappers() {
    const wrappersWithControls = document.querySelectorAll('.wrapper.controls');

    wrappersWithControls.forEach(wrapper => {
        const buttonPrev = wrapper.querySelector(".button-prev");
        buttonPrev.addEventListener("click", () => { moveWrapperItems(wrapper, "prev") });
        
        const buttonNext = wrapper.querySelector(".button-next");
        buttonNext.addEventListener("click", () => { moveWrapperItems(wrapper, -"next") });

        applyDiscounts(wrapper);
    });
}

function applyDiscounts(wrapper) {
    const prices = wrapper.querySelectorAll(".price");

    prices.forEach(price => {
        let offer = price.querySelector(".offer")
        
        if (!offer) return;

        offer = offer.textContent;
        const priceBase = price.querySelector(".base").textContent;

        const discount = (offer * priceBase) / 100;
        const priceWithOffer = Math.trunc((priceBase - discount) * 100) / 100;

        const priceWithOfferContainer = document.createElement("span");
        priceWithOfferContainer.classList.add("now");
        priceWithOfferContainer.textContent = priceWithOffer;

        price.append(priceWithOfferContainer);
    })
}

function moveWrapperItems(wrapper, direction) {
    let indexWrapper = wrapper.getAttribute("data-index");
    indexWrapper = direction == "prev" ? parseInt(indexWrapper) - 1 : parseInt(indexWrapper) + 1;
    
    if (indexWrapper < 0) {
        indexWrapper = 0;
        return;
    }
    
    const widthWrapper = wrapper.clientWidth;
    const wrapperItems = wrapper.querySelector(".wrapper-items");

    const widthItem = wrapperItems.children[0].clientWidth;
    
    const itemsPerPage = Math.floor(widthWrapper / widthItem);
    const gapItems = Math.floor((widthWrapper - (widthItem * itemsPerPage)) / (itemsPerPage - 1));

    const numberPages = (wrapperItems.children.length / itemsPerPage);

    if (indexWrapper > numberPages) {
        indexWrapper = numberPages;
        return;
    }

    let newPage = ((gapItems + widthWrapper) * indexWrapper);

    const missingWidth = ((numberPages - 1) * widthWrapper) + ((numberPages - 1) * gapItems);

    if (newPage > missingWidth) newPage = missingWidth;

    wrapper.setAttribute("data-index", indexWrapper);

    if (indexWrapper == Math.floor(numberPages)) {
        wrapper.classList.add("end");
        wrapper.classList.remove("start");
    } else if (indexWrapper == 0) {
        wrapper.classList.add("start");
        wrapper.classList.remove("end");
    } 

    wrapperItems.style.left = `-${newPage}px`;
}