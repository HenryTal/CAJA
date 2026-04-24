// NPM para colores y estilos de letra en consola.
const colors = require("colors");

// Definición para obtener datos de .env del proyecto.
require("dotenv").config();
// Definición de datos de la aplicación desde .env.
const puertoApp = process.env.APP_PORT || 3000;
const nombreApp = process.env.APP_NAME;

// Definición de aplicación express.
const app = require("./src/express");

// Definición de la base de datos.
const db = require("./src/db");

const Juego = require("./models/Juego");
const Tienda = require("./models/Tienda");
const Usuario = require("./models/Usuario");

const Juego_Tiendas = require("./models/Juego_Tiendas");
const Usuario_Juegos = require("./models/Usuario_Juegos");

async function iniciarCAJA() {
    await db.conectar();

    console.log(`[ ${nombreApp} ] Sincronizando Tablas...`.blue);

    Juego.belongsToMany(Tienda, { through: Juego_Tiendas, foreignKey: 'id_juego' });
    Tienda.belongsToMany(Juego, { through: Juego_Tiendas, foreignKey: 'id_tienda' });

    Usuario.belongsToMany(Juego, { through: Usuario_Juegos, foreignKey: 'id_usuario' });
    Juego.belongsToMany(Usuario, { through: Usuario_Juegos, foreignKey: 'id_juego' });

    const modelos = [Juego, Tienda, Usuario, Juego_Tiendas, Usuario_Juegos];

    for (const modelo of modelos) {
        try {
            await modelo.sync({ force: false });
            console.log(`[ ${nombreApp} ] Tabla ${modelo.name} Sincronizada.`);
        } catch (error) {
            console.log(`[ ${nombreApp} ] Tabla ${modelo.name} No se ha Sincronizado: `.red, error);
            throw error;
        }
    }

    console.log(`[ ${nombreApp} ] Tablas Sincronizadas.`.green);

    // Aplicación ejecutada en el puerto extraido desde .env o el por defecto.
    app.listen(puertoApp, () => {
        console.log(`[ ${nombreApp} ] Página Web en el Puerto ${puertoApp}.`.green);
    });
}

iniciarCAJA();