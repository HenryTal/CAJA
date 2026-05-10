const Genero = require("../models/Genero");

const listGeneros = [
    {
        nombre: "Accion",
    },
    {
        nombre: "Aventura",
    },
    {
        nombre: "RPG",
    },
    {
        nombre: "Simulador",
    }
];

async function getAllGenres(req, res) {
    try {
        const genres = await Genero.findAll();

        res.status(200).json(genres);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener los generos desde base de datos", 
            error: error.message 
        });
    }
}

// Inserta datos a la tabla sin duplicar filas.
async function fillTable() {
    await Genero.bulkCreate(listGeneros, { ignoreDuplicates: true });
}

module.exports = { getAllGenres, fillTable };