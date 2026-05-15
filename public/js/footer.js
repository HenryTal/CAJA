loadFooter();

async function loadFooter() {
    const copyrightYear = document.getElementById("year");
    copyrightYear.textContent = new Date().getFullYear();

    const genresList = await getAllGenres();
    const platformsList = await getAllPlatforms();

    loadFooterSection("genres", "genre", genresList);
    loadFooterSection("platforms", "platform", platformsList);
}

async function loadFooterSection(section, category, list) {
    const footerSection = document.querySelector(`.info-section.${section}`);
    const sectionList = footerSection.querySelector(".list");
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