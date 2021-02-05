const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");
const flash = require('connect-flash')
const passport = require('passport')

//Initializations
const app = express();
require('./database')
require('./config/passport')

//Settings
app.set("port", process.env.PORT || 3000); //available port or 3000
app.set("views", path.join(__dirname, "views")); //Looking for views folder
app.engine(
  ".hbs",
  exphbs({
    defaultLayout: "main",
    layoutsDir: path.join(app.get("views"), "layouts"), //views folder + layouts
    partialsDir: path.join(app.get("views"), "partials"), //Bars and things like that
    extname: ".hbs",
  })
);
app.set("view engine", ".hbs");

//Middlewares
app.use(express.urlencoded({ extended: false })); //Encode URL
app.use(methodOverride("_method"));
app.use(
  session({
    secret: "mysecretapp",
    resave: true,
    saveUninitialized: true,
  })
);
app.use(passport.initialize())
app.use(passport.session())
app.use(flash())

//Global Variables
app.use((req,res,next) =>{
  res.locals.success_msg = req.flash('success_msg')
  res.locals.error_msg = req.flash('error_msg')
  res.locals.error = req.flash('error')
  res.locals.user = req.user;
  
  next()
})
//Routes
app.use(require("./routes/index"));
app.use(require("./routes/notes"));
app.use(require("./routes/users"));

//Static Files
app.use(express.static(path.join(__dirname, "public")));
//Server is listening
app.listen(app.get("port"), () => {
  console.log("Server on port: ", app.get("port"));
});
