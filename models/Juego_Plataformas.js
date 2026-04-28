const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Juego_Plataformas = sequelize.define("Juego_Plataformas", {
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
            model: "plataformas",
            key: "id"
        }
    }
}, {
    tableName: "juego_plataformas",
    timestamps: false
});

module.exports = Juego_Plataformas;