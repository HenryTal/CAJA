const axios = require("axios");
const Usuario_Juegos = require("../models/Usuario_Juegos");

async function addToWishList(req, res) {
    try {
        const id_juego = req.body.id_juego;
        const id_usuario = req.usuario.id;

        if (!id_juego) return res.status(400).json({ error: "Falta el ID del Juego." });

        await Usuario_Juegos.upsert({
            id_usuario: id_usuario,
            id_juego: id_juego,
            en_lista_de_deseos: true
        })

        return res.status(200).json({ success: true, message: "Juego agregado a la lista de deseos" });
    } catch (error) {
        console.error("Error al guardar en deseos:", error);
    }
}

async function removeToWishList(req, res) {
    try {
        const id_juego = req.body.id_juego;
        const id_usuario = req.usuario.id;

        if (!id_juego) return res.status(400).json({ error: "Falta el ID del Juego." });

        const affectedRows = await Usuario_Juegos.destroy({
            where: {
                id_usuario: id_usuario,
                id_juego: id_juego,
                en_lista_de_deseos: true
            }
        });

        if (affectedRows == 0) return res.status(400).json({ success: false, message: "Juego no encontrado en la lista de deseos."});
        else return res.status(200).json({ success: true, message:  "Juego eliminado de la lista de deseos."});
    } catch (error) {
        console.error("Error al elimnar en deseos:", error);
    }
}

async function getWishList(req, res) {
    try {
        if (!req.usuario) return res.status(200).json([]);

        const id_usuario = req.usuario.id;

        const wishList = await Usuario_Juegos.findAll({
            where: {
                id_usuario: id_usuario,
                en_lista_de_deseos: true
            }
        });

        if (wishList) return res.status(200).json(wishList);
        else return res.status(400).json({ success: false, message: "La lista de deseos esta vacia o usuario no existe."});
    } catch (error) {
        console.error("Error al buscar en deseos:", error);
    }
}

module.exports = { addToWishList, removeToWishList, getWishList };