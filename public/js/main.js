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
}



// ╔══════════════════════════════════════════════════════════════════════╗
// ║                                                                      ║
// ║                       MISCELLANEOUS FUNCTIONS                        ║
// ║                                                                      ║
// ╚══════════════════════════════════════════════════════════════════════╝

// Agregar espera entre líneas de código.
const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));




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