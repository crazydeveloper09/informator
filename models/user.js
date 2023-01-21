const mongoose = require("mongoose"),
    passportLocalMongoose = require("passport-local-mongoose");

let userSchema = new mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String
})

userSchema.plugin(passportLocalMongoose)

module.exports = mongoose.model("User", userSchema)