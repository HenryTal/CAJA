const axios = require("axios");

const { Op, where } = require('sequelize');

const Juego = require("../models/Juego");
const Media = require("../models/Media");
const Tienda = require("../models/Tienda");
const Genero = require("../models/Genero");
const Plataforma = require("../models/Plataforma");
const Juego_Tiendas = require("../models/Juego_Tiendas");
const Juego_Plataformas = require("../models/Juego_Plataformas");
const Juego_Generos = require("../models/Juego_Generos");

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const consult = {
    headers: {
        'User-Agent': 'CAJA-Backend/1.0 (henry11.talavera@gmail.com)'
    }
};

/**
 * Obtiene los datos de los juegos que cumplan el filtro.
 * @param {*} req - Datos introducidos en la petición.
 * @param {*} res - Resultado de la petición.
 */
async function getJuegos(req, res) {
    try {
        let filter = req.query;

        // Si no se busca por nombre.
        if (!filter.query) filter.query = "";
        // Aplica el offset a la consulta.
        if (filter.page) filter.offset = parseInt(filter.show * (filter.page - 1)) || 0;

        // Como se incluira la tabla "Tienda" a la respuesta.
        const includesTienda = {
            model: Tienda,
            through: { attributes: [ "precio_actual", "precio_base", "web" ] }
        };
        
        // Como se incluira la tabla "Genero" a la respuesta.
        const includesGenero = {
            model: Genero,
            through: { attributes: [] }
        };
        
        // Como se incluira la tabla "Plataforma" a la respuesta.
        const includesPlataforma = {
            model: Plataforma,
            through: { attributes: [] }
        };

        // Si se filtra por genero.
        if (filter.genre?.length) {
            // Crea un Array con los generos.
            const arrayGenres = Array.isArray(filter.genre) ? filter.genre : [filter.genre];
            
            // La condición del filtro por genero.
            includesGenero.where = {
                nombre: { [Op.in]: arrayGenres}
            };
            includesGenero.required = true;
        }

        // Si se filtra por plataforma.
        if (filter.platform?.length) {
            // Crea un Array con los generos.
            const arrayPlatforms = Array.isArray(filter.platform) ? filter.platform : [filter.platform];
            
            // La condición del filtro por plataforma.
            includesPlataforma.where = {
                nombre: { [Op.in]: arrayPlatforms }
            };
            includesPlataforma.required = true;
        }

        // Si se filtra por plataforma.
        if (filter.shop?.length) {
            // Crea un Array con los generos.
            const arrayShops = Array.isArray(filter.shop) ? filter.shop : [filter.shop];
            
            // La condición del filtro por plataforma.
            includesTienda.where = {
                nombre: { [Op.in]: arrayShops }
            };
            includesTienda.required = true;
        }

        // Incluye las tablas al Array para la consulta.
        const includesOptional = [includesTienda, includesPlataforma, includesGenero];

        // Busca en la tabla "Juego" y cuenta las coincidencias.
        const allGames = await Juego.findAndCountAll({
            where: {
                [Op.or]: [
                    { slug: filter.query }, // Busca por su slug.
                    { titulo: { [Op.like]: `%${filter.query}%` } } // Busca si su titulo es parecido al termino.
                ]
            },
            include: includesOptional, // Incluye las tablas anteriormente preparadas.
            limit: parseInt(filter.show) || 20, // Cuantas coincidencias muestra por página (por defecto es 20).
            offset: filter.offset, // Establece el offset.
            distinct: true, // Evita que cuente las asosiaciones.
            col: "id" // Asegura que cuente solo los juegos.
        })

        // Devuelve el resultado de la consulta.
        res.status(200).json(allGames);
    } catch (error) {
        // En caso de error devuelve un mensaje y el error.
        res.status(500).json({
            message: "Error al obtener los juegos desde la base de datos.",
            error: error
        });

        console.log(error);
    }
}

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
            message: "Error al obtener las plataformas", 
            error: error.message 
        });
    }
}

/**
 * Obtiene los juegos en tendencias.
 * @param {*} req - Datos introducidos en la petición.
 * @param {*} res - Resultado de la petición.
 */
async function getTendencias(req, res) {
    try {
        // Busca en la tabla "Juego".
        let listaJuegos = await Juego.findAll({ 
            where: { es_tendencia: true }, // Los que sean tendencia.
            limit: 20, // Con un limite de 20.
            include: [{
                model: Tienda,
                through: { attributes: ['precio_actual', 'precio_base', 'web'] }
            }] // Incluyendo la conexión con la tabla "Tienda".
        });

        // Si no se han encontrado juegos en la base de datos.
        if (listaJuegos.length == 0) {
            // Obtiene los juegos desde RAWG API.
            let juegosParaInsertar = await getRAWGData();
            // Agrega los datos de IGDB API.
            juegosParaInsertar = await getIGDBData(juegosParaInsertar);
            
            // Inserta los juegos obtenidos a la tabla "Juego" para proximas consultas.
            await Juego.bulkCreate(juegosParaInsertar, { ignoreDuplicates: true });

            // Busca en la tabla "Juegos" para obtener los juegos recien insertados.
            // const juegosParaActualizar = await Juego.findAll({ limit: 20 });

            // Por cada juego.
            for (const game of juegosParaInsertar) {
                // Cambiar a juego en tendencias.
                await Juego.update({ es_tendencia: true }, { where: { slug: game.slug } });

                const gameDB = await Juego.findOne({ where: { slug: game.slug } });

                for (let platform of game.platforms) {
                    platform = platform.platform;
                    const [ platformData, created ] = await Plataforma.findOrCreate({ 
                        where: { id_rawg: platform.id }, 
                        defaults: {
                            nombre: platform.name,
                            id_rawg: platform.id
                        }
                    });
                    
                    // console.log(`[ ${process.env.APP_NAME} ] Actualizando Plataforma (${platformData.nombre}) para el Juego ${game.titulo}`);

                    await Juego_Plataformas.upsert({ id_juego: gameDB.id, id_plataforma: platformData.id });
                }

                for (let genre of game.genres) {
                    const [ genreData, created ] = await Genero.findOrCreate({ 
                        where: { id_rawg: genre.id }, 
                        defaults: {
                            nombre: genre.name,
                            id_rawg: genre.id
                        }
                    });
                    
                    // console.log(`[ ${process.env.APP_NAME} ] Actualizando Genero (${genreData.nombre}) para el Juego ${game.titulo}`);

                    await Juego_Generos.upsert({ id_juego: gameDB.id, id_genero: genreData.id });
                }
                
                // Actualiza los precios.
                await checkShops(gameDB.id);
                // Espera 800ms para evitar problemas con CheapShark API.
                await wait(800);
            }

            console.log(`[ ${process.env.APP_NAME} ] Se han actualizado los precios de ${juegosParaInsertar.length} Juegos.`.green);

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
            message: "Error al obtener los juegos en tendencias",
            error: error.message 
        });
    }
}

// Obtener Juegos desde RAWG API.
async function getRAWGData() {
    const RAWG_TOKEN = process.env.RAWG_TOKEN;
    // const url = `https://api.rawg.io/api/games?key=${RAWG_TOKEN}&page_size=30&ordering=-added`;
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
            platforms: game.platforms,
            genres: game.genres,
            es_tendencia: false
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

    const searchSlugs = games.map(game => `"${game.slug}"`).join(",");

    const searchNames = games.map(game => {
        const nameClean = game.titulo.replace(/['’"\\]/g, "").trim();

        return `name ~ "${game.titulo}"`;
    }).join(" | ");

    const query = `
        fields id,name,slug,summary,cover.url;
        where (${searchNames})
        & version_parent = null 
        & parent_game = null;
        sort popularity desc;
        limit 50;
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
    
    const searchGameIDs = games.filter(game => game.id_igdb != null).map(game => Number(game.id_igdb));
    
    if (searchGameIDs.length == 0) return [];

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
        where game = (${searchGameIDs.join(',')});
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
                },
                {
                    model: Genero,
                    through: { attributes: [] }
                }
            ]
        });

        if (game.Tiendas.length == 0) game = await checkShops(game.id);

        return game;
    } catch (error) {
        return { 
            message: "Error al obtener los juegos en tendencias", 
            error: error.message 
        };
    }
}

async function checkShops(gameID) {
    try {
        let game = await Juego.findByPk(gameID);
        let gameCheapSharkID = game.id_cheapshark;

        if (!gameCheapSharkID || gameCheapSharkID == null) {
            const url = `https://www.cheapshark.com/api/1.0/games?title=${game.titulo}&limit=1`;

            const response = await axios.get(url, consult);
            if (response.data.length > 0) {
                gameCheapSharkID = response.data[0].gameID;
                let gameCheapSharkBG = response.data[0].thumb;
                await game.update({ id_cheapshark: gameCheapSharkID, thumb: gameCheapSharkBG });
            } else {
                console.log(`[ ${process.env.APP_NAME} ] Juego con titulo ${game.titulo} no encontrado en CheapShark.`.red);
                return;
            }
        }
        
        const url = `https://www.cheapshark.com/api/1.0/games?id=${gameCheapSharkID}`;
        
        const response = await axios.get(url, consult);
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
        
        console.log(`[ ${process.env.APP_NAME} ] Actualizando precios para el juego con titulo ${game.titulo}...`);
        
        return game;
    } catch (error) {
        console.log(`[ ${process.env.APP_NAME} ] Error al actualizar los precios para el juego con ID (${gameID}).`);

        return {
            status: error.status,
            message: `Error al actualizar los precios para el juego con ID (${gameID})`, 
            error: error.message 
        };
    }
}

async function getGameMedias(gameID) {
    try {
        const game = await Juego.findByPk(gameID);

        if (game.id_igdb == null) {
            let gameIGDBData = await getIGDBData([game]);
            gameIGDBData = gameIGDBData[0];

            game.id_igdb = gameIGDBData.id_igdb;
            await Juego.upsert(gameIGDBData);
        }

        const medias = await Media.findAll({ where: { id_juego: game.id_igdb } });

        return medias;
    } catch (error) {
        return {
            message: `Error al obtener imagenes de el juego con ID (${gameID})`,
            error: error.message
        }
    }
}

module.exports = { getJuegos, getTendencias, getJuego, getGameMedias };