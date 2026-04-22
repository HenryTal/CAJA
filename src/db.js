const { Sequelize } = require("sequelize");

const sequelize = new Sequelize(
    process.env.DB_NAME,
    process.env.DB_USER,
    process.env.DB_PASSWORD,
    {
        host: process.env.DB_HOST,
        dialect: "mysql",
        port: process.env.DB_PORT,
        logging: false
    }
);

async function conectar() {
    try {
        await sequelize.authenticate();

        console.log(`[ ${process.env.APP_NAME} ] Conexión exitosa a MySQL con Sequelize.`.green);
    } catch (error) {
        console.log(`[ ${process.env.APP_NAME} ] No se ha podido conectar a MySQL con Sequelize: `, error);
    }
}

module.exports = { sequelize, conectar };