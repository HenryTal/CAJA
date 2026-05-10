const Plataforma = require("../models/Plataforma");

const listPlataformas = [
    {
        nombre: "PC (Microsoft Windows)",
        icon: "ri-computer-line"
    },
    {
        nombre: "PlayStation 5",
        icon: "ri-playstation-line"
    },
    {
        nombre: "Xbox Series X|S",
        icon: "ri-xbox-fill"
    },
    {
        nombre: "Nintendo",
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
}

module.exports = { getAllPlatforms, fillTable };