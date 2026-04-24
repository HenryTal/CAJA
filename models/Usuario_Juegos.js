const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Usuario_Juegos = sequelize.define("Usuario_Juegos", {
    id_usuario: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "usuarios",
            key: "id"
        }
    },
    id_juego: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        references: {
            model: "juegos",
            key: "id"
        }
    },
    en_lista_de_deseos: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
    lo_tiene: {
        type: DataTypes.BOOLEAN,
        allowNull: false
    },
}, {
    tableName: "usuario_juegos",
    timestamps: true
});

module.exports = Usuario_Juegos;