const express = require("express");
const router = express.Router();

const juegoController = require("../../controllers/juegoController");

router.get('/tendencias', juegoController.getTendencias);

const fs = require('fs').promises;
const path = require('path');

const patherJson = path.join(__dirname, "../../.test.json");

router.get('/test', async (req, res) => {
    try {
        // 1. Leer el archivo físico
        const data = await fs.readFile(patherJson, 'utf-8');

        // 2. Convertir el texto (String) a un Objeto/Array de JS
        const juegos = JSON.parse(data);

        // 3. Responder al cliente
        res.status(200).json(juegos);
    } catch (error) {
        console.error("Error leyendo el archivo:", error);
        
        // Manejo de error si el archivo no existe
        if (error.code === 'ENOENT') {
            return res.status(404).json({ mensaje: "El archivo no existe" });
        }
        
        res.status(500).json({ mensaje: "Error interno del servidor" });
    }
});

module.exports = router;