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
    thumb: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    background: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    fecha_lanzamiento: {
        type: DataTypes.DATEONLY,
        allowNull: false
    },
    descripcion: {
        type: DataTypes.TEXT,
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
    id_igdb: {
        type: DataTypes.INTEGER,
        allowNull: true
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