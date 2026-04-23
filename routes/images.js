const express = require("express");
const router = express.Router();

const axios = require("axios");
const Juego = require("../models/Juego");

router.get('/games/:slug/cover.jpg', async (req, res) => {
    try {
        const { slug } = req.params;

        const juego = await Juego.findOne({ where: { slug: slug } });

        if (!juego || !juego.poster) {
            return res.status(404).send('Imagen no encontrada');
        }

        const urlOriginal = juego.poster;
        const coverURL = urlOriginal.startsWith('http') ? urlOriginal : `https:${urlOriginal}`;

        const response = await axios.get(coverURL, {
            responseType: 'arraybuffer'
        });

        res.set('Content-Type', response.headers['content-type']);
        res.set('Cache-Control', 'public, max-age=86400');

        res.send(response.data);

    } catch (error) {
        console.error('Error al redireccionar imagen:', error.message);
        res.status(500).send('Error al cargar la imagen');
    }
});

module.exports = router;