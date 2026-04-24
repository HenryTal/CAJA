const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Usuario = sequelize.define("Usuario", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    apellidos: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nombre_usuario: {
        type: DataTypes.STRING,
        allowNull: false
    },
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    contrasenia: {
        type: DataTypes.STRING,
        allowNull: false
    },
    experiencia_total: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0
    }
}, {
    tableName: "usuarios",
    timestamps: false
});

module.exports = Usuario;