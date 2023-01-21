const express             = require("express"),
    app                   = express(),
    bodyParser            = require("body-parser"),
    mongoose              = require("mongoose"),
    methodOverride        = require("method-override"),
    passport              = require("passport"),
    apiRoutes           = require("./routes/api"),
    eventRoutes           = require("./routes/event"),
    guestRoutes           = require("./routes/guest"),
    hotelRoutes            = require("./routes/hotel"),
    indexRoutes           = require("./routes/index"),
    infoRoutes           = require("./routes/info"),
    User = require("./models/user"),
    LocalStrategy 		  = require("passport-local").Strategy,
    flash                 = require("connect-flash"),
	i18n 				  = require("i18n"),
    dotenv                = require("dotenv");
    dotenv.config();

// Connecting to database
mongoose.connect(process.env.DATABASE_URL, {useNewUrlParser: true});

// App configuration
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(__dirname + "/public"));
app.use(flash());
app.use(methodOverride("_method"));


i18n.configure({
    locales: ["en", "pl"],
   	register: global,
	defaultLocale: 'en',
    directory: __dirname + '/locales',
})

app.use(i18n.init);


app.use(require("express-session")({
    secret: "heheszki",
    resave: false,
    saveUninitialized: false
}));
app.use(function(req, res, next) {
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    res.locals.currentUser = req.user;
    res.locals.language = i18n;
    res.locals.userLanguage = req.language;
    next();
});
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(indexRoutes)
app.use("/api", apiRoutes)
app.use("/hotels", hotelRoutes)
app.use("/infos", infoRoutes)
app.use("/events", eventRoutes)
app.use("/guests", guestRoutes)


app.listen(process.env.PORT);