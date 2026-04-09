// Cuando la página termina de cargar llama al método loadFunctions
window.addEventListener("load", loadFunctions);

// Clases para los iconos de tema oscuro y claro.
let iconThemeDark = "ri-moon-fill";
let iconThemeLight = "ri-sun-fill";

// Método que define lo necesario para el funcionamiento de los elementos dinamicos
// en la página web.
function loadFunctions() {
    // Boton para cambiar entre el tema oscuro y claro.
    const buttonChangeTheme = document.getElementById("changeTheme");
    // Sincroniza el icono con el tema seleccionado.
    syncTheme(buttonChangeTheme);
    buttonChangeTheme.addEventListener("click", switchTheme);
}

// Método que sincroniza el icono a mostrar en el botón que cambia entre
// el tema oscuro y claro.
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