window.addEventListener("load", startCarousel);

// Método que define las variables necesarias para
// el funcionamiento del carrusel de elementos básico
// e iniciarlo.
function startCarousel() {
    // Busca todos los carruseles en la página.
    const carousels = document.querySelectorAll(".carousel");

    // Por cada carrusel.
    for (let carousel of carousels) {
        // Busca su contenedor de elementos.
        const itemsContainer = carousel.querySelector(".carousel-items");
        // Busca en ese contenedor los elementos del carrusel.
        const items = itemsContainer.querySelectorAll(".carousel-item");

        // Desplaza el contenedor de elementos hacia la izquierda
        // el ancho de un elemento en pixeles.
        itemsContainer.style.left = `-${items[0].clientWidth}px`;

        // Inicia el indice del carrusel a 0.
        let index = 0;

        // Crea una copia del primer elemento del carrusel.
        const firstItem = items[0].cloneNode(true);
        // Quita la clase "active" a la copia.
        firstItem.classList.remove("active");
        // Agrega la clase "copy" a la copia.
        firstItem.classList.add("copy");
        // Crea una copia del ultimo elemento del carrusel.
        const lastItem = items[items.length - 1].cloneNode(true);
        // Agrega la clase "copy" a la copia.
        lastItem.classList.add("copy");

        // Agrega la copia del primer elemento antes que los
        // elementos actuales del carrusel.
        itemsContainer.appendChild(firstItem);
        // Agrega la copia del último elemento despues que los
        // elementos actuales del carrusel.
        itemsContainer.prepend(lastItem);

        // Busca el botón para ver el elemento anterior del carrusel.
        const buttonPrev = carousel.querySelector(".button-prev");
        // Agrega un evento para volver al elemento anterior en el carrusel.
        buttonPrev.addEventListener("click", async () => index = await prevItem(itemsContainer, items, index));
        
        // Busca el botón para ver el siguiente elemento del carrusel.
        const buttonNext = carousel.querySelector(".button-next");
        // Agrega un evento para ir al siguiente elemento en el carrusel.
        buttonNext.addEventListener("click", async () => index = await nextItem(itemsContainer, items, index));

        // Si tiene la clase "autoslide" agrega un intervalo para
        // cambiar el elemento mostrado en el carrusel automáticamente.
        if (carousel.classList.contains("autoslide")) 
            setInterval(async () => index = await nextItem(itemsContainer, items, index), carousel.getAttribute("data-interval") || 10000);
    }
}

/**
 * Volver al elemento anterior en el carrusel.
 * @param {HTMLDivElement} itemsContainer - Contenedor de los elementos del carrusel.
 * @param {HTMLElement} items - Elementos del carrusel.
 * @param {number} index - Indice actual del carrusel.
 * @returns Indice despues de volver al elemento anterior.
 */
async function prevItem(itemsContainer, items, index) {
    // Quita la clase "active" al elemento actual.
    items[index].classList.remove("active");
    
    // Si el indice es 0 es porque quiere ver el último elemento
    // del carrusel.
    if (index == 0) {
        // Establece el indice a el último elemento del carrusel.
        index = (items.length - 1);
        
        // El elemento activo ahora es el nuevo elemento mostrado.
        const activeItem = items[index];
        // Le agrega la clase "active".
        activeItem.classList.add("active");

        // Desplaza el contenedor de elementos hacia la izquierda
        // donde esta la copia del ultimo elemento.
        itemsContainer.style.left = `0px`;
        
        // Espera 500 milisegundos.
        await wait(500);
        // Quita las animaciones del carrusel.
        itemsContainer.classList.remove("animate");
        // Desplaza el contenedor de elementos hasta el último elemento.
        itemsContainer.style.left = `-${(index + 1) * activeItem.clientWidth}px`;
        
        // Espera 500 milisegundos.
        await wait(500);
        // Le agrega las animaciones al carrusel.
        itemsContainer.classList.add("animate");
    } else { 
        index -= 1; // Si no quiere ir al último elemento simplemente resta uno al indice.
        
        // El elemento activo ahora es el nuevo elemento mostrado.
        const activeItem = items[index];
        // Le agrega la clase "active".
        activeItem.classList.add("active");

        // Desplaza el contenedor de elementos hasta el elemento activo.
        itemsContainer.style.left = `-${(index + 1) * activeItem.clientWidth}px`;
    }

    // Devuelve el indice actual del carrusel.
    return index;
}

/**
 * Ir al siguiente elemento en el carrusel.
 * @param {HTMLDivElement} itemsContainer - Contenedor de los elementos del carrusel.
 * @param {HTMLElement} items - Elementos del carrusel.
 * @param {number} index - Indice actual del carrusel.
 * @returns Indice despues de ir al siguiente elemento.
 */
async function nextItem(itemsContainer, items, index) {
    // Quita la clase "active" al elemento actual.
    items[index].classList.remove("active");

    // Si el elemento actual es el último elemento del carrusel.
    if (index == (items.length - 1)) {
        // Establece el indice a 0.
        index = 0;
        
        // El elemento activo ahora es el nuevo elemento mostrado.
        const activeItem = items[index];
        // Agrega la clase "active" al elemento activo.
        activeItem.classList.add("active");
        
        // Desplaza el contenedor de elementos hacia la derecha
        // donde esta la copia del primer elemento del carrusel.
        itemsContainer.style.left = `-${(items.length + 1) * activeItem.clientWidth}px`;
        
        // Espera 500 milisegundos.
        await wait(500);
        // Quita las animaciones del carrusel.
        itemsContainer.classList.remove("animate");
        // Desplaza el contenedor de elementos hasta el primer
        // elemento del carrusel.
        itemsContainer.style.left = `-${items[0].clientWidth}px`;
        
        // Espera 500 milisegundos.
        await wait(500);
        // Agrega las animaciones al carrusel.
        itemsContainer.classList.add("animate");
    } else {
        index += 1; // Si no era el último elemento simplemento aumenta en uno el indice.
        
        // El elemento activo ahora es el nuevo elemento mostrado.
        const activeItem = items[index];
        // Agrega la clase "active" al elemento activo.
        activeItem.classList.add("active");
    
        // Desplaza el contenedor de elementos hasta el elemento activo.
        itemsContainer.style.left = `-${(index + 1) * activeItem.clientWidth}px`;
    }

    // Devuelve el indice actual del carrusel.
    return index;
}