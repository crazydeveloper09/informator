const mongoose = require("mongoose");

let hotelSchema = new mongoose.Schema({
    name: String,
    city: String,
    street: String,
    phone: String,
    description: String,
    descriptionEn: String,
    important: String,
    importantEn: String,
    fact: String,
    factEn: String
})

module.exports = mongoose.model("Hotel", hotelSchema);