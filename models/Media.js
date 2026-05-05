const { DataTypes } = require("sequelize");
const { sequelize } = require("../src/db");

const Media = sequelize.define("Media", {
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    id_igdb: {
        type: DataTypes.BIGINT,
        unique: true,
        allowNull: false
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    id_image: {
        type: DataTypes.STRING,
        allowNull: false
    },
    id_juego: {
        type: DataTypes.BIGINT,
        allowNull: false
    }
}, {
    tableName: "medias",
    timestamps: false
});

module.exports = Media;