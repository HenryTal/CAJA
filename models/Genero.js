const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Genero = sequelize.define("Genero", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    }
}, {
    tableName: "generos",
    timestamps: false
});

module.exports = Genero;