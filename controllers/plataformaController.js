const axios = require("axios");
const Plataforma = require("../models/Plataforma");

const listPlataformas = [
    {
        nombre: "PC",
        icon: "ri-computer-line"
    },
    {
        nombre: "PlayStation 5",
        icon: "ri-playstation-line"
    },
    {
        nombre: "Xbox Series S/X",
        icon: "ri-xbox-fill"
    },
    {
        nombre: "Nintendo Switch",
        icon: "ri-switch-line"
    }
];

async function getAllPlatforms(req, res) {
    try {
        const platforms = await Plataforma.findAll();

        res.status(200).json(platforms);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener las plataformas desde base de datos", 
            error: error.message 
        });
    }
}

async function fillTable() {
    await Plataforma.bulkCreate(listPlataformas, { ignoreDuplicates: true });

    try {
        const RAWG_TOKEN = process.env.RAWG_TOKEN;

        const url = `https://api.rawg.io/api/platforms?key=${RAWG_TOKEN}&page_size=20`;
        const response = await axios.get(url);

        const platformsList = response.data.results;

        for (const platform of platformsList) {
            await Plataforma.upsert({
                nombre: platform.name,
                id_rawg: platform.id,
                logo: platform.image
            });
        }
    } catch (error) {
        console.error("Error al actualizar plataformas: ", error);
    }
}

module.exports = { getAllPlatforms, fillTable };