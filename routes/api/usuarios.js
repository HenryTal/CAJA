const express = require("express");
const router = express.Router();

const { validateToken } = require("../../middleware/auth");
const { addToWishList, removeToWishList, getWishList, getInfoUser, getUsuario } = require("../../controllers/usuarioController");

router.use(express.json());

router.post('/info', validateToken, getInfoUser);
router.post('/wishlist/get', validateToken, getWishList);
router.post('/wishlist/add', validateToken, addToWishList);
router.post('/wishlist/remove', validateToken, removeToWishList);

router.get('/:username', async (req, res) => {
    let username = req.params.username;

    res.status(200).json(await getUsuario(username));
});

module.exports = router;