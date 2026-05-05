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
const Media = require("./models/Media");
const Tienda = require("./models/Tienda");
const tiendaController = require("./controllers/tiendaController");

const Plataforma = require("./models/Plataforma");
const plataformaController = require("./controllers/plataformaController");

const Genero = require("./models/Genero");
const generoController = require("./controllers/generoController");

const Usuario = require("./models/Usuario");
const usuarioController = require("./controllers/usuarioController");

const Juego_Tiendas = require("./models/Juego_Tiendas");
const Juego_Plataformas = require("./models/Juego_Plataformas");
const Juego_Generos = require("./models/Juego_Generos");
const Usuario_Juegos = require("./models/Usuario_Juegos");

async function iniciarCAJA() {
    await db.conectar();

    console.log(`[ ${nombreApp} ] Sincronizando Tablas...`.cyan);

    Juego.belongsToMany(Tienda, { through: Juego_Tiendas, foreignKey: 'id_juego' });
    Tienda.belongsToMany(Juego, { through: Juego_Tiendas, foreignKey: 'id_tienda' });

    Juego.belongsToMany(Plataforma, { through: Juego_Plataformas, foreignKey: 'id_juego' });
    Plataforma.belongsToMany(Juego, { through: Juego_Plataformas, foreignKey: 'id_plataforma' });
    
    Juego.belongsToMany(Genero, { through: Juego_Generos, foreignKey: 'id_juego' });
    Genero.belongsToMany(Juego, { through: Juego_Generos, foreignKey: 'id_genero' });
    
    Juego.belongsToMany(Usuario, { through: Usuario_Juegos, foreignKey: 'id_juego' });
    Usuario.belongsToMany(Juego, { through: Usuario_Juegos, foreignKey: 'id_usuario' });
    
    const modelos = [Juego, Media, Tienda, Usuario, Plataforma, Genero, Juego_Tiendas, Juego_Plataformas, Juego_Generos, Usuario_Juegos];
    
    for (const modelo of modelos) {
        try {
            await modelo.sync({ force: false });
            console.log(`[ ${nombreApp} ] Tabla ${modelo.name} Sincronizada.`);
        } catch (error) {
            console.log(`[ ${nombreApp} ] Tabla ${modelo.name} No se ha Sincronizado: `.red, error);
            throw error;
        }
    }

    await plataformaController.fillTable();
    await tiendaController.fillTable();
    await generoController.fillTable();
    await usuarioController.fillTable();

    console.log(`[ ${nombreApp} ] Tablas Sincronizadas.`.green);

    // Aplicación ejecutada en el puerto extraido desde .env o el por defecto.
    app.listen(puertoApp, () => {
        console.log(`[ ${nombreApp} ] Página Web en el Puerto ${puertoApp}.`.green);
    });
}

iniciarCAJA();