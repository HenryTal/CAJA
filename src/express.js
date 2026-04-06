// Definición de Express y una aplicación express.
const express = require("express");
const app = express();

// Definición de engine para usar Handlebars
const { engine } = require("express-handlebars");

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

module.exports = app;