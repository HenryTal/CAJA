loadNavbar();

async function loadNavbar() {
    const genresList = await getAllGenres();
    const platformsList = await getAllPlatforms();
    const shopsList = await getAllShops();

    loadNavBarSection("genres", "genre", genresList);
    loadNavBarSection("platforms", "platform", platformsList);
    loadNavBarSection("shops", "shop", shopsList);
}

async function loadNavBarSection(section, category, list) {
    const navbarSection = document.querySelector(`.item-menu.${section}`);
    const sectionList = navbarSection.querySelector(`.${category}.list`);
    sectionList.innerHTML = "";
    
    for (let item of list) {
        const listItem = document.createElement("li");
        listItem.classList.add("list-item");
    
        const listLink = document.createElement("a");
        listLink.classList.add("link");
        listLink.href = `/search?${category}=${item.nombre}`;
        listLink.textContent = item.nombre;
    
        listItem.append(listLink);
        sectionList.append(listItem);
    }
}