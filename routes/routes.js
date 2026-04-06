const express = require("express");
const router = express.Router();

// Ruta HOME para la página web.
router.get('/', (req, res) => {
    // Renderizar la página HOME.
    res.render("inicio", {
        titulo: "Inicio"
    });
});

module.exports = router;