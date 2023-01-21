const express = require("express"),
    User = require("../models/user"),
    Guest = require("../models/guest"),
    passport = require("passport"),
    i18n = require("i18n"),
    router = express.Router();

router.get("/", (req, res) => {
    User.find({}).limit(2).exec((err, users) => {
       if(err) {
           console.log(err);
       } else {
           i18n.setLocale(req.language);
           
            let header = "Informator ślubny | Magda i Josh";
            res.render("index", {currentUser: req.user, lang:req.language, users: users, header: header, home:""});
       }
   });
});

router.get("/login", (req, res) => {
    let header = "Logowanie | Magda i Josh";
    res.render("login", {header: header});
});




router.post("/login", passport.authenticate("local", {
    successRedirect: "/dashboard",
    failureRedirect: "/login",
    failureFlash: true
}), (req, res) =>  {
   
});



router.get("/register", (req, res) => {
    i18n.setLocale(req.language);
    let header = "Rejestracja | Magda i Joshua";
    res.render("register", {header: header});
});
router.post("/register", (req, res) => {
    let newUser = new User({
        username: req.body.username,
        email: req.body.email,
        name: req.body.name
    });
    User.register(newUser, req.body.password, function(err, user) {
        if(err) {
            req.flash("error", err.message)
            return res.render("register", {user: req.body, error: err.message});
        } 
        passport.authenticate("local")(req, res, function() {
            req.flash("success", i18n.__('Witaj ') + req.body.username + i18n.__(' w panelu administracyjnym'));
            res.redirect("/login");
        });
    });
});

router.get("/logout", (req, res) =>  {
    req.logout();
    res.redirect("/");
});

router.get("/dashboard", isLoggedIn, function(req, res) {
    Guest.find({}, function(err, guests){
        if(err) {
            console.log(err);
        } else {
            
            let header = `Wszyscy goście | Magda i Joshua`;
            res.render("./guests/index", {guests: guests, currentUser: req.user, lang:req.language, header: header, my:""});
        }
    });
})

router.get("/user/:user_id/edit", isLoggedIn, (req, res) => {
    User.findById(req.params.user_id, (err, user) => {
        if(err){
            console.log(err)
        } else {
            let header = "Edytuj dane kontaktowe | Magda i Josh";
            res.render("uedit", {
                header: header,
                user: user
            })
        }
    })
})

router.put("/user/:user_id", isLoggedIn, (req, res) => {
    User.findByIdAndUpdate(req.params.user_id, req.body.user, (err, updatedUser) => {
        if(err){
            console.log(err)
        } else {
            res.redirect("/dashboard")
        }
    })
})

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