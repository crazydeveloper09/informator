const mongoose = require("mongoose");

let eventSchema = new mongoose.Schema({
    name: String,
    nameEn: String,
    time: String,
    timeEn: String,
    description: String,
    descriptionEn: String
})

module.exports = mongoose.model("Event", eventSchema);