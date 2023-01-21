const mongoose = require("mongoose");

let guestSchema = new mongoose.Schema({
    name: String,
    isHere: String,
    room: String,
    comments: String,
    bathroom: String,
    confirmDate: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("Guest", guestSchema)