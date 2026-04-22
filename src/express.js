// Definición de Express y una aplicación express.
const express = require("express");
const app = express();

// Definición de engine para usar Handlebars
const { engine } = require("express-handlebars");

// Definición del archivo con las rutas.
const router = require("../routes/routes");
const apiJuegosRouter = require("../routes/api/juegos");

// Definición de la extención de los archivos para render.
app.engine(".hbs", engine({
    extname:"hbs"
}));
// Definición en view para usar la extensión anterior.
app.set('view engine', '.hbs');
// Definición de la carpeta views.
app.set("views", "./views")
// Definición de la carpeta public.
app.use("/", express.static("./public"));
// Aplicación usara el router anterior para las rutas '/';
app.use('/', router);
app.use('/api/juegos/', apiJuegosRouter);

module.exports = app;