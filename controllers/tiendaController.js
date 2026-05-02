const Tienda = require("../models/Tienda");

const listTiendas = [
    {
        nombre: "Steam",
        icon: "ca-steam-fill"
    },
    {
        nombre: "Epic Games",
        icon: "ca-epic-games-fill"
    },
    {
        nombre: "Xbox",
        icon: "ca-xbox-live-fill"
    },
    {
        nombre: "Instant Gaming",
        icon: "ca-instant-gaming-fill"
    },
];

async function fillTable() {
    await Tienda.bulkCreate(listTiendas, { ignoreDuplicates: true });
}

module.exports = { fillTable };