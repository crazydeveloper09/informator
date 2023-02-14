const express = require("express"),
    Guest = require("../models/guest"),
    User = require("../models/user"),
    app = express(),
    methodOverride = require("method-override"),
	mailgun 				  = require("mailgun-js"),
    dotenv                = require("dotenv"),
    flash = require("connect-flash"),
    router = express.Router();
    dotenv.config();
   
app.use(flash());
app.use(methodOverride("_method"));



router.get("/confirm",  function(req, res){
    
    let header = "Potwierdź uczestnictwo | Martyna i Maciek";
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
                const subject = `${guest.name} wypełnili ankietę w informatorze`;
                const text = `Informacje o gościach: <br><br>
                    Imiona: <strong>${guest.name}</strong> <br>
                    Przyjęcie: <strong>${guest.isHere}</strong> <br>
                    Nocleg: <strong>${guest.room}</strong> <br>
                    Uwagi: <strong>${guest.comments}</strong> <br>
                    `;

                User
                    .find({})
                    .exec()
                    .then((users) => {
                        users.forEach((user) => {
                            sendEmail(subject, user.email, text);
                        })
                        if(req.language === 'pl'){
                            req.flash("success", "Dziękujemy za potwierdzenie uczestnictwa");
                            res.redirect("/");
                        } else {
                            req.flash("success", "Thank you for confirming your participation");
                            res.redirect("/");
                        }
                    })
                    .catch((err) => console.log(err))
                
            }
        });
    
});



router.get("/:id/delete", isLoggedIn, function(req, res){
    Guest.findByIdAndDelete(req.params.id, function(err, deletedguest){
        if(err) {
            console.log(err);
        } else {
            res.redirect("/dashboard");
        }
    });
});

const sendEmail = async (subject, to, text) => {
    const DOMAIN = 'websiteswithpassion.pl';
    const mg = mailgun({ apiKey: process.env.MAILGUN_API_KEY, domain: DOMAIN, host: "api.eu.mailgun.net" });
    const data = {
        from: `Potwierdzenie uczestnictwa w przyjęciu <admin@websiteswithpassion.pl>`,
        to: to,
        subject: subject,
        html: `<html>
                <head>
                    <link rel="stylesheet" href="https://stackpath.bootstrapcdn.com/bootstrap/4.3.1/css/bootstrap.min.css"
                        integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">
                    <link rel="stylesheet" type="text/css" href="./style.css">
                </head>
                <body>
                    ${text}
                </body>
            </html>`
    };
    mg.messages().send(data, function (error, body) {
        if (error) {
            console.log(error)
        }
    });
}


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