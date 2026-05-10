loadFilters();

async function loadFilters() {
    const formFilter = document.getElementById("filter");
    const query = new URLSearchParams(window.location.search);

    formFilter.addEventListener("change", (e) => {
        console.log(`Se ha cambiado el filtro ${e.target.name} ha ${e.target.value}.`);

        let dataForm = new FormData(formFilter);

        if (dataForm.has("genres")) dataForm.delete("genres");
        else if (dataForm.has("platforms")) dataForm.delete("platforms");

        for (const [name, value] of dataForm.entries()) {
            if (value.trim() !== "") query.set(name, value);
            else query.delete(name);
        }

        changePage(`/search?${query.toString()}`, true);
    });

    const containerGenres = document.querySelector(".field.genres");
    const allGenres = await getAllGenres();
    containerGenres.append(...createCheckBoxList(allGenres));

    const containerPlatforms = document.querySelector(".field.platforms");
    const allPlatforms = await getAllPlatforms();
    containerPlatforms.append(...createCheckBoxList(allPlatforms));

    const containerShops = document.querySelector(".field.shops");
    const allShops = await getAllShops();
    containerShops.append(...createCheckBoxList(allShops));

    imagesLoading();
}

/**
 * Crea una lista de checkboxes.
 * @param {JSON} list - JSON con los elementos de la lista.
 * @returns Un Array de elementos HTML.
 */
function createCheckBoxList(list) {
    const containerList = document.createElement("div");

    containerList.append(createCheckBox("Todos", ""));

    const query = new URLSearchParams(window.location.search);
    
    for (const checkBox of list) {
        let icon = checkBox.icon ? checkBox.icon : checkBox.id;

        const checkBoxCreated = createCheckBox(checkBox.nombre, checkBox.nombre, icon);
        checkBoxCreated.querySelector('input[type="checkbox"').checked = query.getAll("genre").includes(checkBox.nombre);

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
function createCheckBox(name, value, icon) {
    const container = document.createElement("div");
    container.classList.add("field-checkbox", "genre");
    
    const checkBox = document.createElement("input");
    checkBox.setAttribute("type", "checkbox");
    checkBox.setAttribute("name", "genre");
    checkBox.classList.add("checkGenre");
    checkBox.value = value;
    checkBox.id = `genre-${value}`;

    const label = document.createElement("label");
    label.setAttribute("for", `genre-${value}`);

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