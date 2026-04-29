const axios = require("axios");
const Usuario = require("../models/Usuario");
const Juego = require("../models/Juego");
const Usuario_Juegos = require("../models/Usuario_Juegos");

const listUsuarios = [
    {
        nombre: "Admin",
        apellidos: "Admin",
        nombre_usuario: "Admin",
        email: "admin@caja.es",
        contrasenia: "$2b$10$epexeXqIHKPtNX9dUFxzS.k/mEP75ST4FrgrUrHmS/y9CgQhdU4AS"
    },
    {
        nombre: "Lista",
        apellidos: "de Deseos",
        nombre_usuario: "wishList",
        email: "wishlist@caja.es",
        contrasenia: "$2b$10$X3QgI98J0ze2/ZV6CkrBUe1pVD37zwb10W9R9WqMhFbjgp1jrWDMi"
    },
    {
        nombre: "Usuario1",
        apellidos: "Prueba",
        nombre_usuario: "usuarioExtra1",
        email: "correo1@caja.es",
        contrasenia: "$2b$10$epexeXqIHKPtNX9dUFxzS.k/mEP75ST4FrgrUrHmS/y9CgQhdU4AS"
    },
    {
        nombre: "Usuario2",
        apellidos: "Prueba",
        nombre_usuario: "usuarioExtra2",
        email: "correo2@caja.es",
        contrasenia: "$2b$10$X3QgI98J0ze2/ZV6CkrBUe1pVD37zwb10W9R9WqMhFbjgp1jrWDMi"
    }
];

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

async function getUsuario(username) {
    try {
        let user = await Usuario.findOne({ 
            where: { nombre_usuario: username },
            attributes: [ "id", "nombre_usuario", "experiencia_total" ],
            include: [
                {
                    model: Juego,
                    through: { attributes: [ "en_lista_de_deseos", "lo_tiene" ] }
                }
            ]
        });

        return user;
    } catch (error) {
        return { 
            mensaje: "Error al usuario en la base de datos.", 
            error: error.message 
        };
    }
}

async function getInfoUser(req, res) {
    try {
        const id_usuario = req.usuario.id;

        const wishList = await Usuario.findOne({
            where: {
                id: id_usuario
            },
            attributes: [ "id", "nombre", "apellidos", "nombre_usuario", "email" ],
            include: [
                {
                    model: Juego,
                    through: { attributes: [ "en_lista_de_deseos", "lo_tiene" ] }
                }
            ]
        });

        if (wishList) return res.status(200).json(wishList);
        else return res.status(400).json({ success: false, message: "El usuario no tiene información en la base de datos."});
    } catch (error) {
        console.error("Error al buscar en base de datos:", error);
    }
}

async function fillTable() {
    await Usuario.bulkCreate(listUsuarios, { ignoreDuplicates: true });
}

module.exports = { addToWishList, removeToWishList, getWishList, getInfoUser, getUsuario, fillTable };