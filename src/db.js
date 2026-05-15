const { Sequelize } = require("sequelize");
const mysql = require('mysql2/promise');

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
    await createDataBase();
    
    try {
        await sequelize.authenticate();

        console.log(`[ ${process.env.APP_NAME} ] Conexión exitosa a MySQL con Sequelize.`.green);
    } catch (error) {
        console.log(`[ ${process.env.APP_NAME} ] No se ha podido conectar a MySQL con Sequelize: `, error);
    }
}

async function createDataBase() {
    try {
        const connection = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD
        });
        
        await connection.query(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\`;`);
        
        console.log(`[ ${process.env.APP_NAME} ] Base de Datos Lista.`.green);
    } catch (error) {
        console.log(`[ ${process.env.APP_NAME} ] No se ha podido crear la Base de Datos: `, error);
    }
}

module.exports = { sequelize, conectar };