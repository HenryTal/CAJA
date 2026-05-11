const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Plataforma = sequelize.define("Plataforma", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_rawg: {
        type: DataTypes.INTEGER,
        unique: true,
        allowNull: true
    },
    nombre: {
        type: DataTypes.STRING,
        unique: true,
        allowNull: false
    },
    icon: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "plataformas",
    timestamps: false
});


module.exports = Plataforma;