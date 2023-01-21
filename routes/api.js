const express             = require("express"),
    app                   = express(),
    router                = express.Router(),
    methodOverride        = require("method-override"),
    Event                = require("../models/event"),
    Hotel              = require("../models/hotel"),
    flash                 = require("connect-flash"),
    Info              = require("../models/info"),
    dotenv                = require("dotenv");

dotenv.config();

app.use(methodOverride("_method"));
app.use(flash());

router.get("/events", (req, res) => {
    Event.find({}, function(err, events){
        if(err){
            console.log(err);
        } else {
           
            res.json(events);
           
        }
    })
});

router.get("/hotels", (req, res) => {
    Hotel.find({}, (err, hotels) => {
        if(err) {
            res.json(err);
        } else {
            res.json(hotels);
        }
    })
})

router.get("/infos", (req, res) => {
    Info.find({}, (err, infos) => {
        if(err){
            res.json(err);
        } else {
            
            res.json(infos);
        }
    })
})



function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    req.flash("error", "Nie masz dostępu do tej strony");
    res.redirect("/");
}

module.exports =router;