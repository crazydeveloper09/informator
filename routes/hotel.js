const express = require("express"),
    Hotel = require("../models/hotel"),
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
    
    let header = "Dodaj hotel | Magda i Joshua";
    res.render("./hotels/new", { header: header});
      
});


router.get("/", isLoggedIn, function(req, res){
    Hotel.find({}, function(err, hotels){
        if(err) {
            console.log(err);
        } else {
            
            let header = `Wszystkie hotele | Magda i Joshua`;
            res.render("./hotels/index", {hotels: hotels, currentUser: req.user, lang:req.language, header: header, my:""});
        }
    });
});

router.post("/", isLoggedIn, function(req, res){
    
        let newHotel = new Hotel({
            name: req.body.name,
            city: req.body.city,
            street: req.body.street,
            phone: req.body.phone,
            important: req.body.important,
            importantEn: req.body.importantEn,
            fact: req.body.fact,
            factEn: req.body.factEn,
            description: req.body.description,
            descriptionEn: req.body.descriptionEn
        });
        Hotel.create(newHotel, function(err, hotel){
            if(err) {
                console.log(err);
            } else {
                res.redirect("/hotels");
            }
        });
    
    
});




router.get("/:id/edit", isLoggedIn, function(req, res){
    Hotel.findById(req.params.id, function(err, hotel){
        if(err) {
            console.log(err);
        } else {
            let header = `Edytuj hotel | ${hotel.name} | Magda i Joshua`;
            res.render("./hotels/edit", {hotel: hotel, header:header});
        }
    });
});



router.put("/:id", isLoggedIn, function(req, res){
    Hotel.findByIdAndUpdate(req.params.id, req.body.hotel, function(err, updatedhotel){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/hotels");
        }
    });
});

router.get("/:id/delete", isLoggedIn, function(req, res){
    Hotel.findByIdAndDelete(req.params.id, function(err, deletedhotel){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/hotels");
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