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
    })
});

router.get('/auth/login', (req, res) => {
    res.render("login", {
        title: "Iniciar Sesión"
    })
});

module.exports = router;