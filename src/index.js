const express = require("express");
const path = require("path");
const exphbs = require("express-handlebars");
const methodOverride = require("method-override");
const session = require("express-session");

//Initializations
const app = express();
require('./database')

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
//Global Variables

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
