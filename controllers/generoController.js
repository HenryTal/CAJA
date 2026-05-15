const Genero = require("../models/Genero");

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
    const rows = Genero.count();
    
    if (rows != 0) return;

    try {
        const RAWG_TOKEN = process.env.RAWG_TOKEN;

        const url = `https://api.rawg.io/api/genres?key=${RAWG_TOKEN}&page_size=20`;
        const response = await axios.get(url);

        const genresList = response.data.results;

        for (const genre of genresList) {
            await Genero.upsert({
                nombre: genre.name,
                id_rawg: genre.id
            });
        }
    } catch (error) {
        console.error("Error al actualizar generos: ", error);
    }
}

module.exports = { getAllGenres, fillTable };