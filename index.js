// NPM para colores y estilos de letra en consola.
const colors = require("colors");

// Definición para obtener datos de .env del proyecto.
require("dotenv").config();
// Definición de datos de la aplicación desde .env.
const puertoApp = process.env.APP_PORT || 3000;
const nombreApp = process.env.APP_NAME;

// Definición de aplicación express y routes.
const app = require("./src/express");
const router = require("./routes/routes");

// Aplicación usara el router anterior para las rutas '/';
app.use('/', router);

app.listen(puertoApp, () => {
    console.log(`[ ${nombreApp} ] Página Web en el Puerto ${puertoApp}.`.green);
});