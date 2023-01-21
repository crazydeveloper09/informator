const mongoose = require("mongoose");

let infoSchema = new mongoose.Schema({
    name: String,
    nameEn: String,
    place: String,
    placeEn: String,
    city: String,
    street: String,
    time: String
})

module.exports = mongoose.model("Info", infoSchema)