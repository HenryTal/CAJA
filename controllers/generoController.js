const Genero = require("../models/Genero");

const listGeneros = [
    {
        nombre: "Acción",
    },
    {
        nombre: "Aventura",
    },
    {
        nombre: "RPG",
    },
    {
        nombre: "Simulador",
    }
];

async function fillTable() {
    await Genero.bulkCreate(listGeneros, { ignoreDuplicates: true });
}

module.exports = { fillTable };