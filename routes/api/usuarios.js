const express = require("express");
const router = express.Router();

const { validateToken } = require("../../middleware/auth");
const { addToWishList, removeToWishList, getWishList } = require("../../controllers/usuarioController");

router.use(express.json());

router.post('/wishlist/get', validateToken, getWishList);
router.post('/wishlist/add', validateToken, addToWishList);
router.post('/wishlist/remove', validateToken, removeToWishList);

module.exports = router;