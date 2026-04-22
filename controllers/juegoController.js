const axios = require("axios");
const Juego = require("../models/Juego");
const Tienda = require("../models/Tienda");

async function getTendencias(req, res) {
    try {
        let listaJuegos = await Juego.findAll({ 
            where: { es_tendencia: true },
            limit: 10,
            include: [{
                model: Tienda,
                through: { attributes: ['precio_actual', 'web'] }
            }]
        });

        if (listaJuegos.length == 0) {
            const juegosParaInsertar = await obtenerTest();
            
            // Usamos bulkCreate para insertar todos de golpe
            // ignoreDuplicates: true evita errores si el slug ya existe
            await Juego.bulkCreate(juegosParaInsertar, { ignoreDuplicates: true });

            // Recuperamos los datos recién insertados
            listaJuegos = await Juego.findAll();
        }

        res.status(200).json(listaJuegos);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener los juegos en tendencias", 
            error: error.message 
        });
    }
}

async function obtenerTest() {
    const API_KEY = process.env.RAWG_KEY; // Tu API Key de RAWG
    // const url = `https://api.rawg.io/api/games?key=${API_KEY}&page_size=12&ordering=-added`;
    const url = `http://127.0.0.1:3010/api/juegos/test`;

    try {
        const response = await axios.get(url);
        const resultados = response.data.results;

        // Mapeamos los datos de la API a tus columnas de Sequelize
        return resultados.map(game => ({
            titulo: game.name,
            slug: game.slug,
            // Guardamos la imagen de RAWG
            imagen_url: game.background_image,
            descripcion: "",
            fecha_lanzamiento: game.released,
            es_tendencia: true
        }));
    } catch (error) {
        console.error('Error en el fetch de RAWG:', error);
        return [];
    }
}

module.exports = { getTendencias };