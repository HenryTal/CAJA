const express = require("express");
const router = express.Router();

const juegoController = require("../controllers/juegoController");

router.get("/:slug", async (req, res) => {
    const gameSlug = req.params.slug;

    try {
        const game = await juegoController.getJuego(gameSlug);
        const gameTitulo = game.titulo;

        res.render("game", {
            title: `Comprar ${gameTitulo}`
        });
    } catch (error) {
        console.error("Error Juego no Encontrado: ", error);
    }
});

module.exports = router;