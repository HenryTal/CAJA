const axios = require("axios");

const Juego = require("../models/Juego");
const Media = require("../models/Media");
const Tienda = require("../models/Tienda");
const Plataforma = require("../models/Plataforma");
const Juego_Tiendas = require("../models/Juego_Tiendas");

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

/**
 * Obtiene las plataformas de un juego buscado por su ID.
 * @param {*} req - Datos introducidos en la petición.
 * @param {*} res - Resultado de la petición.
 */
async function getPlataformas(req, res) {
    try {
        // El ID introducido en la petición.
        let gameID = req.body.id_juego;

        // Busca en la tabla
        let plataformas = await Juego_Plataformas.findAll({ 
            include: [{
                model: Plataforma,
                through: { attributes: [] }
            }]
        });
    
        res.status(200).json(plataformas);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener las plataformas", 
            error: error.message 
        });
    }
}

async function getTendencias(req, res) {
    try {
        let listaJuegos = await Juego.findAll({ 
            where: { es_tendencia: true },
            limit: 20,
            include: [{
                model: Tienda,
                through: { attributes: ['precio_actual', 'precio_base', 'web'] }
            }]
        });

        if (listaJuegos.length == 0) {
            let juegosParaInsertar = await getTest();
            juegosParaInsertar = await getIGDBData(juegosParaInsertar);
            
            // Usamos bulkCreate para insertar todos de golpe
            // ignoreDuplicates: true evita errores si el slug ya existe
            await Juego.bulkCreate(juegosParaInsertar, { ignoreDuplicates: true });

            const juegosParaActualizar = await Juego.findAll({ limit: 20 });

            for (const game of juegosParaActualizar) {
                await checkShops(game.id);
                await wait(200);
            }

            console.log(`[ CAJA ] Se han actualizado los precios de ${juegosParaActualizar.length} Juegos.`.green);

            // Recuperamos los datos recién insertados
            listaJuegos = await Juego.findAll({ 
                where: { es_tendencia: true },
                limit: 20,
                include: [{
                    model: Tienda,
                    through: { attributes: ['precio_actual', 'precio_base', 'web'] }
                }]
            });
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
    const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
    const IGDB_TOKEN = process.env.IGDB_TOKEN;

    const url = "https://api.igdb.com/v4/games";

    const searchSlugs = games.map(game => (game.slug));

    let searchNames = games.map(game => (game.titulo));
    searchNames = searchNames.map(name => `name ~ "${name}"`).join(" | ");
    
    const query = `
        fields id,
        name,
        slug,
        summary,
        cover.url;
        where 
            (
                slug = ("${searchSlugs.join('", "')}") |
                (${searchNames})
            ) &
            version_parent = null &
            parent_game = null;
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
        
        // console.log(`[ IGDB ] Buscando información para ${game.slug}...`.cyan);
        
        if (gameDataIGDB == undefined) {
            // console.log(`[ IGDB ] Nada encontrado para ${game.slug} o ${game.titulo}.`.red);
            continue;
        }
        
        game.id_igdb = gameDataIGDB.id;
        game.poster = gameDataIGDB.cover.url.replace("t_thumb", "t_cover_big");
        game.descripcion = gameDataIGDB.summary;

        // console.log(`[ IGDB ] Juego Encontrado con el ID (${gameDataIGDB.id})`.green);
    }

    await getGamesArtworks(games);

    return games;
}

async function getGamesArtworks(games) {
    const IGDB_CLIENT_ID = process.env.IGDB_CLIENT_ID;
    const IGDB_TOKEN = process.env.IGDB_TOKEN;

    let url = "https://api.igdb.com/v4/artworks";
    
    const searchGameIDs = games.filter(game => game.id_igdb).map(game => (game.id_igdb));
    
    const artQuery = `
        fields 
            alpha_channel,
            animated,
            artwork_type,
            checksum,
            game,
            height,
            image_id,
            url,
            width;
        where game = (${searchGameIDs.join(', ')});
        limit 100;
    `;
    
    let artworksData = [];
    
    try {
        const response = await axios({
            url: url,
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': IGDB_CLIENT_ID,
                'Authorization': `Bearer ${IGDB_TOKEN}`,
                'Content-Type': 'text/plain'
            },
            data: artQuery
        });
        
        artworksData = response.data;
    } catch (error) {
        console.error('Error en IGDB:', error.response ? error.response.data : error.message);
        throw error;
    }

    url = "https://api.igdb.com/v4/screenshots";

    const screenshotsQuery = `
        fields 
            alpha_channel,
            animated,
            checksum,
            game,
            height,
            image_id,
            url,
            width;
        where game = (${searchGameIDs.join(', ')});
        limit 150;
    `;
    
    try {
        const response = await axios({
            url: url,
            method: "POST",
            headers: {
                'Accept': 'application/json',
                'Client-ID': IGDB_CLIENT_ID,
                'Authorization': `Bearer ${IGDB_TOKEN}`,
                'Content-Type': 'text/plain'
            },
            data: screenshotsQuery
        });

        artworksData.push(...response.data);
    } catch (error) {
        console.error('Error en IGDB:', error.response ? error.response.data : error.message);
        throw error;
    }

    let artWorksStorable = artworksData.map(art => ({
        id_igdb: art.id,
        url: art.url.replace("t_thumb", "t_1080p"),
        id_image: art.image_id,
        id_juego: art.game
    }));

    Media.bulkCreate(artWorksStorable, { ignoreDuplicates: true });

    return artworksData;
}

async function getJuego(slug) {
    try {
        let game = await Juego.findOne({ 
            where: { slug: slug },
            include: [
                {
                    model: Tienda,
                    through: { attributes: [ "precio_actual", "precio_base", "web" ] }
                },
                {
                    model: Plataforma,
                    through: { attributes: [] }
                }
            ]
        });

        return game;
    } catch (error) {
        return { 
            mensaje: "Error al obtener los juegos en tendencias", 
            error: error.message 
        };
    }
}

async function checkShops(gameID) {
    try {
        let game = await Juego.findByPk(gameID);
        let gameCheapSharkID = game.id_cheapshark;
        
        if (!gameCheapSharkID) {
            const url = `https://www.cheapshark.com/api/1.0/games?title=${game.titulo}&limit=1`;
            
            const response = await axios.get(url);
            
            if (response.data.length > 0) {
                gameCheapSharkID = response.data[0].gameID;
                let gameCheapSharkBG = response.data[0].thumb;
                await game.update({ id_cheapshark: gameCheapSharkID, thumb: gameCheapSharkBG });
            } else {
                console.log(`[ CAJA ] Juego con titulo ${game.titulo} no encontrado en CheapShark.`.red);
                return;
            }
        }
        
        const url = `https://www.cheapshark.com/api/1.0/games?id=${gameCheapSharkID}`;
        
        const response = await axios.get(url);
        const offers = response.data.deals;
        
        for (const offer of offers) {
            const shop = await Tienda.findOne({ where: { id_cheapshark: offer.storeID } });
            
            await Juego_Tiendas.upsert({
                id_juego: game.id,
                id_tienda: shop.id,
                precio_base: offer.retailPrice,
                precio_actual: offer.price,
                web: `https://www.cheapshark.com/redirect?dealID=${offer.dealID}`
            });
        }
        
        console.log(`[ CAJA ] Actualizando precios para el juego con titulo ${game.titulo}...`);

        return game;
    } catch (error) {
        return { 
            mensaje: "Error al obtener los juegos en tendencias", 
            error: error.message 
        };
    }
}

async function getGameMedias(gameID) {
    try {
        const game = await Juego.findByPk(gameID);
        const medias = await Media.findAll({ where: { id_juego: game.id_igdb } });

        return medias;
    } catch (error) {
        return {
            mensaje: `Error al obtener imagenes de el juego con ID (${gameID}`,
            error: error.message
        }
    }
}

module.exports = { getTendencias, getJuego, getGameMedias };