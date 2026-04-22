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

        res.status(200).json(listaJuegos);
    } catch (error) {
        res.status(500).json({ 
            mensaje: "Error al obtener los juegos en tendencias", 
            error: error.message 
        });
    }
}

module.exports = { getTendencias };