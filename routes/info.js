const express = require("express"),
    Info = require("../models/info"),
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
    
    let header = "Dodaj info | Martyna i Maciek";
    res.render("./infos/new", { header: header});
      
});


router.get("/", isLoggedIn, function(req, res){
    Info.find({}, function(err, infos){
        if(err) {
            console.log(err);
        } else {
            
            let header = `Wszystkie info | Martyna i Maciek`;
            res.render("./infos/index", {infos: infos, currentUser: req.user, lang:req.language, header: header, my:""});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    
        let newInfo = new Info({
            name: req.body.name,
            nameEn: req.body.nameEn,
            place: req.body.place,
            placeEn: req.body.placeEn,
            city: req.body.city,
            street: req.body.street,
            time: req.body.time
        });
        Info.create(newInfo, function(err, info){
            if(err) {
                console.log(err);
            } else {
                res.redirect("/infos");
            }
        });
    
    
});




router.get("/:id/edit", isLoggedIn, function(req, res){
    Info.findById(req.params.id, function(err, info){
        if(err) {
            console.log(err);
        } else {
            let header = `Edytuj | ${info.name} | Martyna i Maciek`;
            res.render("./infos/edit", {info: info, header:header});
        }
    });
});



router.put("/:id", isLoggedIn, function(req, res){
    Info.findByIdAndUpdate(req.params.id, req.body.info, function(err, updatedinfo){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/infos");
        }
    });
});

router.get("/:id/delete", isLoggedIn, function(req, res){
    Info.findByIdAndDelete(req.params.id, function(err, deletedinfo){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/infos");
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


module.exports = router;