const express = require("express");
const router = express.Router();

// Ruta HOME para la página web.
router.get('/', (req, res) => {
    // Renderizar la página HOME.
    res.render("inicio", {
        title: "Inicio"
    });
});

router.get('/test', (req, res) => {
    res.render("navigationTest", {
        title: "Prueba de SPA"
    });
});

const usuarioController = require("../controllers/usuarioController");

router.get('/usuario/:username', (req, res) => {
    let username = req.params.username;
    
    res.render("usuario", {
        title: `Perfil de ${username}`
    });
});

router.get('/search', (req, res) => {
    const { query } = req.query;

    res.render("search", {
        title: `Resultados para ${query}`
    });
});

module.exports = router;