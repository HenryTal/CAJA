const axios = require("axios");
const Tienda = require("../models/Tienda");

const listTiendas = [
    {
        nombre: "Steam",
        icon: "ca-steam-fill"
    },
    {
        nombre: "Epic Games Store",
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
    {
        nombre: "GameBillet",
        icon: "ca-gamebillet-fill"
    },
];

async function fillTable() {
    await Tienda.bulkCreate(listTiendas, { ignoreDuplicates: true });

    try {
        const url = "https://www.cheapshark.com/api/1.0/stores";
        const response = await axios.get(url);

        const storesList = response.data;

        for (const store of storesList) {
            await Tienda.upsert({
                nombre: store.storeName,
                id_cheapshark: store.storeID,
                logo: `https://www.cheapshark.com${store.images.logo}`,
                icon_alt: `https://www.cheapshark.com${store.images.icon}`
            });
        }
    } catch (error) {
        console.error("Error al actualizar tiendas: ", error);
    }
}

module.exports = { fillTable };