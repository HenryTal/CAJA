const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Juego = sequelize.define("Juego", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    titulo: {
        type: DataTypes.STRING,
        allowNull: false
    },
    slug: {
        type: DataTypes.STRING,
        allowNull: false
    },
    poster: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    fecha_lazamiento: {
        type: DataTypes.DATE,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_cheapshark: {
        type: DataTypes.STRING,
        allowNull: true
    },
    id_rawg: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    es_tendencia: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    }
}, {
    tableName: "juegos",
    timestamps: false
});

module.exports = Juego;