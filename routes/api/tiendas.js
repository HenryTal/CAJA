const express = require("express");
const router = express.Router();

const tiendaController = require("../../controllers/tiendaController");

router.get("/", tiendaController.getAllShops);

module.exports = router;