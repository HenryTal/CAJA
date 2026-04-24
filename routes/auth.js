const express = require("express");
const router = express.Router();

const Usuario = require("../models/Usuario");

const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

router.use(express.json());

router.post('/login', async (req, res) => {
    const { email, contrasenia } = req.body;

    const usuario = await Usuario.findOne({ where: { email } });

    const salt = await bcrypt.genSalt(10);
    const hashParaLaDB = await bcrypt.hash(contrasenia, salt);

    if (!usuario) return res.status(401).json({ message: "Credenciales Incorrectas", contraseniaHash: hashParaLaDB });

    const esValida = await bcrypt.compare(contrasenia, usuario.contrasenia);


    if (!esValida || !usuario) return res.status(401).json({ message: "Credenciales Incorrectas" });

    const token = jwt.sign(
        { id: usuario.id, nombre_usuario: usuario.nombre_usuario }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
    );

    res.json({ token });
});

module.exports = router;