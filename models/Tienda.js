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
        allowNull: false
    },
    banner: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    logo: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    icon: {
        type: DataTypes.TEXT,
        allowNull: false
    }
}, {
    tableName: "tiendas",
    timestamps: false
});

module.exports = Tienda;