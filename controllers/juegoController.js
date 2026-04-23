const axios = require("axios");
const Juego = require("../models/Juego");
const Tienda = require("../models/Tienda");

async function getTendencias(req, res) {
    try {
        let listaJuegos = await Juego.findAll({ 
            where: { es_tendencia: true },
            limit: 20,
            include: [{
                model: Tienda,
                through: { attributes: ['precio_actual', 'web'] }
            }]
        });

        if (listaJuegos.length == 0) {
            let juegosParaInsertar = await getTest();
            juegosParaInsertar = await getIGDBData(juegosParaInsertar);
            
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

async function getTest() {
    const RAWG_TOKEN = process.env.RAWG_TOKEN; // Tu API Key de RAWG
    // const url = `https://api.rawg.io/api/games?key=${RAWG_TOKEN}&page_size=12&ordering=-added`;
    const url = `http://127.0.0.1:3010/api/juegos/test`;

    try {
        const response = await axios.get(url);
        const resultados = response.data.results;

        return resultados.map(game => ({
            titulo: game.name,
            slug: game.slug,
            imagen_url: game.background_image,
            descripcion: "",
            id_rawg: game.id,
            fecha_lanzamiento: game.released,
            es_tendencia: true
        }));
    } catch (error) {
        console.error('Error en el fetch de RAWG:', error);
        return [];
    }
}

async function getIGDBData(games) {
    const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID
    const IGDB_TOKEN = process.env.IGDB_TOKEN

    const url = "https://api.igdb.com/v4/games";

    let searchParams = "";

    for (let game of games) {
        if (searchParams != "") searchParams += " | ";
        searchParams += (game.titulo == "") ? `slug = "${game.slug}"` : `name = "${game.titulo}"`;
    }

    const query = `
        fields id,
               name,
               slug,
               summary,
               cover.url;
        where ${searchParams};
        limit 20;
    `;

    let gamesData = [];

    try {
        gamesData = await axios({
            url: url,
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': IGDB_CLIENT_ID,
                'Authorization': `Bearer ${IGDB_TOKEN}`,
                'Content-Type': 'text/plain'
            },
            data: query
        });

        gamesData = gamesData.data;
    } catch (error) {
        console.error('Error en IGDB:', error.response ? error.response.data : error.message);
        throw error;
    }
    
    for (let game of games) {
        const gameDataIGDB = gamesData[gamesData.findIndex(data => (data.slug == game.slug || data.name == game.titulo))];
        
        if (gameDataIGDB == undefined) continue;
    
        game.poster = gameDataIGDB.cover.url.replace("t_thumb", "t_cover_big");
        game.descripcion = gameDataIGDB.summary;    
    }

    return games;
}

module.exports = { getTendencias };