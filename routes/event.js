const express = require("express"),
    Event = require("../models/event"),
    app = express(),
    methodOverride = require("method-override"),
	i18n 				  = require("i18n"),
    dotenv                = require("dotenv"),
    flash = require("connect-flash"),
    router = express.Router();
    dotenv.config();
   
app.use(flash());
app.use(methodOverride("_method"));



router.get("/new", isLoggedIn, function(req, res){
    
    let header = "Dodaj wydarzenie | Magda i Joshua";
    res.render("./events/new", { header: header});
      
});


router.get("/", isLoggedIn, function(req, res){
    Event.find({}, function(err, events){
        if(err) {
            console.log(err);
        } else {
            
            let header = `Wszystkie wydarzenia | Magda i Joshua`;
            res.render("./events/index", {events: events, currentUser: req.user, lang:req.language, header: header, my:""});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    
        let newEvent = new Event({
            name: req.body.name,
            nameEn: req.body.nameEn,
            time: req.body.time,
            description: req.body.description,
            descriptionEn: req.body.descriptionEn
        });
        Event.create(newEvent, function(err, event){
            if(err) {
                console.log(err);
            } else {
                res.redirect("/events");
            }
        });
    
    
});




router.get("/:id/edit", isLoggedIn, function(req, res){
    Event.findById(req.params.id, function(err, event){
        if(err) {
            console.log(err);
        } else {
            let header = `Edytuj | ${event.name} | Magda i Joshua`;
            res.render("./events/edit", {event: event, header:header});
        }
    });
});



router.put("/:id", isLoggedIn, function(req, res){
    Event.findByIdAndUpdate(req.params.id, req.body.event, function(err, updatedevent){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/events");
        }
    });
});

router.get("/:id/delete", isLoggedIn, function(req, res){
    Event.findByIdAndDelete(req.params.id, function(err, deletedevent){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/events");
        }
    });
});

function isLoggedIn(req, res, next) {
    if(req.isAuthenticated()) {
        return next();
    }
    if(req.language === 'pl'){
        req.flash("error", "Nie masz dostępu do tej strony");
        res.redirect("/");
    } else {
        req.flash("error", "You do not have access to this page");
        res.redirect("/");
    }
}


module.exports = router
