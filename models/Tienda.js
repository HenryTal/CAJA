const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Tienda = sequelize.define("Tienda", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    nombre: {
        type: DataTypes.STRING,
        allowNull: false
    },
    banner: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    banner: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    logo: {
        type: DataTypes.TEXT,
        allowNull: true
    },
    icon: {
        type: DataTypes.TEXT,
        allowNull: true
    }
}, {
    tableName: "tiendas",
    timestamps: false
});

module.exports = Tienda;