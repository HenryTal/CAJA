loadFilters();

async function loadFilters() {
    const formFilter = document.getElementById("filter");
    const query = new URLSearchParams(window.location.search);
    
    let gamesPerPage = parseInt(query.get("show")) || 20;
    
    const resultsContainer = document.getElementById("results");
    const resultsWrapperItems = resultsContainer.querySelector(".wrapper-items");
    
    for (let i = 0; i < gamesPerPage - 1; i++) {
        let newItemLayOut = resultsWrapperItems.children[0].cloneNode(true);
        resultsWrapperItems.append(newItemLayOut);
    }

    const containerGenres = document.querySelector(".field.genres");
    const containerWrapperGenres = containerGenres.querySelector(".wrapper");
    
    if (!containerWrapperGenres.children[0]) {
        const allGenres = await getAllGenres();
        containerWrapperGenres.append(...createCheckBoxList("genre", allGenres));
    }

    const containerPlatforms = document.querySelector(".field.platforms");
    const containerWrapperPlatforms = containerPlatforms.querySelector(".wrapper");

    if (!containerWrapperPlatforms.children[0]) {
        const allPlatforms = await getAllPlatforms();
        containerWrapperPlatforms.append(...createCheckBoxList("platform", allPlatforms));
    }

    const containerShops = document.querySelector(".field.shops");
    const containerWrapperShops = containerShops.querySelector(".wrapper");

    if (!containerWrapperShops.children[0]) {
        const allShops = await getAllShops();
        containerWrapperShops.append(...createCheckBoxList("shop", allShops));
    }
    
    formFilter.addEventListener("change", (e) => {
        let dataForm = new FormData(formFilter);

        query.delete("genre");
        query.delete("platform");
        query.delete("shop");

        if (dataForm.has("genre")) dataForm.delete("genres");
        else if (dataForm.has("platform")) dataForm.delete("platforms");
        else if (dataForm.has("shop")) dataForm.delete("shops");

        for (const [name, value] of dataForm.entries()) {
            if (value.trim() !== "") query.set(name, value);
            else query.delete(name);
        }

        changeContent(`/search?${query.toString()}`, "results", "results", true);
    });
    
    const foundGames = await getGames(query);

    if (!foundGames.rows || foundGames.count == 0) {
        resultsWrapperItems.innerHTML = "";
        resultsWrapperItems.append(gamesNotFound());
        imagesLoading();
        return;
    }
    
    let actualPage = parseInt(query.get("page")) || 1;
    let pages = Math.round(foundGames.count / gamesPerPage) || 1;
    
    if (actualPage > pages) {
        query.set("page", pages);
        changeContent(`/search?${query.toString()}`, "results", "results", true);
    }

    const counter = document.querySelector(".counter");
    const showing = (gamesPerPage * actualPage) > foundGames.count ? foundGames.count : (gamesPerPage * actualPage);
    counter.textContent = `Mostrando ${showing} de ${foundGames.count} Juegos.`;
    
    const numberPage = document.getElementById("numberPage");

    const buttonPrev = numberPage.querySelector(".button-prev");
    if (actualPage != 1) buttonPrev.classList.remove("disabled");
    buttonPrev.addEventListener("click", () => {
        if (buttonPrev.classList.contains("disabled")) return;

        let copyQuery = new URLSearchParams(query.toString());
        copyQuery.set("page", (actualPage - 1));
        changeContent(`/search?${copyQuery.toString()}`, "results", "results", true);
    });

    const buttonNext = numberPage.querySelector(".button-next");
    if (actualPage != pages) buttonNext.classList.remove("disabled");
    buttonNext.addEventListener("click", () => {
        if (buttonNext.classList.contains("disabled")) return;

        let copyQuery = new URLSearchParams(query.toString());
        copyQuery.set("page", (actualPage + 1));
        changeContent(`/search?${copyQuery.toString()}`, "results", "results", true);
    });
    
    const pageInput = numberPage.querySelector("#page");
    pageInput.value = actualPage;
    
    const pageMaxLink = document.createElement("a");
    pageMaxLink.classList.add("link");
    pageMaxLink.textContent = pages;
    
    let copyQuery = new URLSearchParams(query.toString());
    copyQuery.set("page", (pages));
    pageMaxLink.href = `/search?${copyQuery.toString()}`;
    numberPage.querySelector(".total").innerHTML = "";
    numberPage.querySelector(".total").append("de ", pageMaxLink);

    document.querySelector(".info").classList.remove("loading");

    resultsWrapperItems.innerHTML = "";

    for (const game of foundGames.rows) {
        resultsWrapperItems.append(createGameItem(game));
    }

    imagesLoading();
}

async function getGames(filter) {
    try {
        const response = await fetch(`/api/juegos?${filter}`);

        if (response.ok) {
            const data = response.json();

            return data;
        } else {
            return {
                message: "Error al obtener los juegos con esos filtros.",
                error: response.message
            };
        }
    } catch (error) {
        return {
            message: "Error al realizar la consulta al servidor.",
            error: response.message
        };
    }
}

/**
 * Crea una lista de checkboxes.
 * @param {JSON} list - JSON con los elementos de la lista.
 * @returns Un Array de elementos HTML.
 */
function createCheckBoxList(nameList, list) {
    const containerList = document.createElement("div");

    containerList.append(createCheckBox(nameList, "Todos", ""));

    const query = new URLSearchParams(window.location.search);
    
    for (const checkBox of list) {
        let icon = checkBox.icon ? checkBox.icon : checkBox.id;

        const checkBoxCreated = createCheckBox(nameList, checkBox.nombre, checkBox.nombre, icon);
        checkBoxCreated.querySelector('input[type="checkbox"').checked = query.getAll(nameList).includes(checkBox.nombre);

        containerList.append(checkBoxCreated);
    }

    return containerList.children;
}

/**
 * Crea un checkbox para la lista de checkboxes.
 * @param {String} name - Nombre del Checkbox.
 * @param {String} value - Valor del Checkbox.
 * @returns {HTMLInputElement} - El elemento checkbox.
 */
function createCheckBox(nameList, name, value, icon) {
    const container = document.createElement("div");
    container.classList.add("field-checkbox", nameList);
    
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("name", nameList);
    checkBox.classList.add("checkGenre");
    checkBox.value = value;
    checkBox.id = `${nameList}-${value}`;

    const label = document.createElement("label");
    label.setAttribute("for", `${nameList}-${value}`);

    let iconLabel = document.createElement("i");
    iconLabel.classList.add(icon);
    label.append(iconLabel, name);

    container.append(checkBox, label);

    return container;
}

// Obtener todos las plataformas en la base de datos.
async function getAllPlatforms() {
    try {
        // Hace la petición a la API.
        const response = await fetch("/api/plataformas/");

        // Si la petición devuelve las plataformas.
        if (response.ok) {
            // La convierte en JSON.
            const allGenres = response.json();

            // La devuelve.
            return allGenres
        } else {
            // Mostrar por consola el error que se ha producido en la consulta.
            console.log(response.message);
        }
    } catch (error) {
        // Mostrar por consola el error en la ejecución.
        console.log("Error al obtener la lista de plataformas:", error);
    }
}

// Obtener todos los generos en la base de datos.
async function getAllGenres() {
    try {
        // Hace la petición a la API.
        const response = await fetch("/api/generos/");

        // Si la petición devuelve los generos.
        if (response.ok) {
            // La convierte en JSON.
            const allGenres = response.json();

            // La devuelve.
            return allGenres
        } else {
            // Mostrar por consola el error que se ha producido en la consulta.
            console.log(response.message);
        }
    } catch (error) {
        // Mostrar por consola el error en la ejecución.
        console.log("Error al obtener la lista de generos:", error);
    }
}

// Obtener todos las tiendas en la base de datos.
async function getAllShops() {
    try {
        // Hace la petición a la API.
        const response = await fetch("/api/tiendas/");

        // Si la petición devuelve las tiendas.
        if (response.ok) {
            // La convierte en JSON.
            const allShops = response.json();

            // La devuelve.
            return allShops
        } else {
            // Mostrar por consola el error que se ha producido en la consulta.
            console.log(response.message);
        }
    } catch (error) {
        // Mostrar por consola el error en la ejecución.
        console.log("Error al obtener la lista de tiendas:", error);
    }
}