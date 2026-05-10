const express = require("express");
const router = express.Router();

const plataformaController = require("../../controllers/plataformaController");

router.get("/", plataformaController.getAllPlatforms);

module.exports = router;