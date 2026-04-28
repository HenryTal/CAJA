const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Juego_Generos = sequelize.define("Juego_Generos", {
    id_juego: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "juegos",
            key: "id"
        }
    },
    id_plataforma: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "generos",
            key: "id"
        }
    }
}, {
    tableName: "juego_generos",
    timestamps: false
});

module.exports = Juego_Generos;