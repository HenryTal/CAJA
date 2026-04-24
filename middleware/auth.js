const jwt = require('jsonwebtoken');

function validateToken(req, res, next) {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(403).send("Se requiere un token para la autenticación");
    }

    try {
        const decoded = jwt.verify(token.split(" ")[1], process.env.JWT_SECRET);
        req.usuario = decoded; 
    } catch (err) {
        return res.status(401).send("Token no válido");
    }
    
    return next();
};

module.exports = { validateToken };