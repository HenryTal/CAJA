const Plataforma = require("../models/Plataforma");

const listPlataformas = [
    {
        nombre: "PC (Microsoft Windows)",
        icon: "ri-computer-line"
    },
    {
        nombre: "PlayStation 5",
        icon: "ri-playstation-line"
    },
    {
        nombre: "Xbox Series X|S",
        icon: "ri-xbox-fill"
    },
    {
        nombre: "Nintendo",
        icon: "ri-switch-line"
    }
];

async function fillTable() {
    await Plataforma.bulkCreate(listPlataformas, { ignoreDuplicates: true });
}

module.exports = { fillTable };