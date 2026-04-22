const express = require("express");
const router = express.Router();

const juegoController = require("../../controllers/juegoController");

router.get('/tendencias', juegoController.getTendencias);

module.exports = router;