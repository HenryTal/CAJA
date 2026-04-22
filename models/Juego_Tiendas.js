const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Juego_Tiendas = sequelize.define("Juego_Tiendas", {
    id_juego: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "juegos",
            key: "id"
        }
    },
    id_tienda: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "tiendas",
            key: "id"
        }
    },
    precio_actual: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    precio_base: {
        type: DataTypes.DECIMAL(10, 2),
        defaultValue: 0.00
    },
    web: {
        type: DataTypes.STRING,
    }
}, {
    tableName: "juego_tiendas",
    timestamps: true
});

module.exports = Juego_Tiendas;