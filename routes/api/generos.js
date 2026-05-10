const express = require("express");
const router = express.Router();

const generoController = require("../../controllers/generoController");

router.get("/", generoController.getAllGenres);

module.exports = router;