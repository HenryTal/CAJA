const express = require("express");
const router = express.Router();

const { Op } = require('sequelize');

const Usuario = require("../models/Usuario");

const jwt = require('jsonwebtoken');
const bcrypt = require("bcryptjs");

router.use(express.json());

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    const usuario = await Usuario.findOne({ where: { email: email } });

    if (!usuario) return res.status(401).json({ message: "Credenciales Incorrectas" });

    const esValida = await bcrypt.compare(password, usuario.contrasenia);


    if (!esValida || !usuario) return res.status(401).json({ message: "Credenciales Incorrectas" });

    const token = jwt.sign(
        { id: usuario.id, nombre_usuario: usuario.nombre_usuario }, 
        process.env.JWT_SECRET, 
        { expiresIn: '24h' }
    );

    res.json({ token });
});

router.get('/login', (req, res) => {
    res.render("login", {
        title: "Iniciar Sesión"
    })
});


router.post('/register', async (req, res) => {
    const { name, lastname, username, email, password } = req.body;

    const usuarioEmail = await Usuario.findOne({ where: { email: email } });
    const usuarioUsername = await Usuario.findOne({ where: { nombre_usuario: username } })

    if (usuarioEmail) return res.status(409).json({ message: "Ya existe una Cuenta con ese Correo Electronico" });
    if (usuarioUsername) return res.status(409).json({ message: "Ese nombre de usuario ya esta en uso" });

    const salt = await bcrypt.genSalt(10);
    const passwordHashed = await bcrypt.hash(password, salt);

    Usuario.create({
        nombre: name,
        apellidos: lastname,
        nombre_usuario: username,
        email: email,
        contrasenia: passwordHashed
    });

    res.status(200).json({ message: "Cuentra registrada correctamente" });
});

router.get('/register', (req, res) => {
    res.render("register", {
        title: "Registrarse en CAJA"
    })
});

module.exports = router;