const express = require("express"),
    Guest = require("../models/guest"),
    app = express(),
    methodOverride = require("method-override"),
	i18n 				  = require("i18n"),
    dotenv                = require("dotenv"),
    flash = require("connect-flash"),
    router = express.Router();
    dotenv.config();
   
app.use(flash());
app.use(methodOverride("_method"));



router.get("/confirm",  function(req, res){
    
    let header = "Potwierdź uczestnictwo | Magda i Joshua";
    res.render("./guests/confirm", { header: header});
      
});




router.post("/",function(req, res){
   
        let newGuest = new Guest({
            name: req.body.name,
            isHere: req.body.isHere,
            room: req.body.room,
            comments: req.body.comments,
            bathroom: req.body.bathroom
        });
        Guest.create(newGuest, function(err, guest){
            if(err) {
                console.log(err);
            } else {
                if(req.language === 'pl'){
                    req.flash("success", "Dziękujemy za potwierdzenie uczestnictwa");
                    res.redirect("/");
                } else {
                    req.flash("success", "Thank you for confirming your participation");
                    res.redirect("/");
                }
                
            }
        });
    
});



router.get("/:id/delete", isLoggedIn, function(req, res){
    Guest.findByIdAndDelete(req.params.id, function(err, deletedguest){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/");
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