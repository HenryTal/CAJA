const express = require("express");
const router = express.Router();

const axios = require("axios");
const Juego = require("../models/Juego");
const Tienda = require("../models/Tienda");
const Media = require("../models/Media");

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

router.get('/games/:slug/thumb.jpg', async (req, res) => {
    try {
        const { slug } = req.params;

        const juego = await Juego.findOne({ where: { slug: slug } });

        if (!juego || !juego.thumb) {
            return res.status(404).send('Imagen no encontrada');
        }

        const urlOriginal = juego.thumb;
        const thumbURL = urlOriginal.startsWith('http') ? urlOriginal : `https:${urlOriginal}`;

        const response = await axios.get(thumbURL, {
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

router.get('/games/:slug/background.jpg', async (req, res) => {
    try {
        const { slug } = req.params;

        const juego = await Juego.findOne({ where: { slug: slug } });

        if (!juego || !juego.background) {
            return res.status(404).send('Imagen no encontrada');
        }

        const urlOriginal = juego.background;
        const backgroundURL = urlOriginal.startsWith('http') ? urlOriginal : `https:${urlOriginal}`;

        const response = await axios.get(backgroundURL, {
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

router.get('/medias/:id_image.jpg', async (req, res) => {
    try {
        const { id_image } = req.params;

        const media = await Media.findOne({ where: { id_image: id_image } });

        if (!media) {
            return res.status(404).send('Imagen no encontrada');
        }

        const urlOriginal = media.url;
        const mediaURL = urlOriginal.startsWith('http') ? urlOriginal : `https:${urlOriginal}`;

        const response = await axios.get(mediaURL, {
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

router.get('/stores/:id_store/icon.png', async (req, res) => {
    try {
        const { id_store } = req.params;

        const store = await Tienda.findByPk(id_store);

        if (!store) {
            return res.status(404).send('Imagen no encontrada');
        }

        const urlOriginal = store.icon_alt;
        const mediaURL = urlOriginal.startsWith('http') ? urlOriginal : `https:${urlOriginal}`;

        const response = await axios.get(mediaURL, {
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

router.get('/stores/:id_store/logo.png', async (req, res) => {
    try {
        const { id_store } = req.params;

        const store = await Tienda.findByPk(id_store);

        if (!store) {
            return res.status(404).send('Imagen no encontrada');
        }

        const urlOriginal = store.logo;
        const mediaURL = urlOriginal.startsWith('http') ? urlOriginal : `https:${urlOriginal}`;

        const response = await axios.get(mediaURL, {
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