const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const expressValidator = require("express-validator");
const flash = require("connect-flash");
const session = require("express-session");
const config = require('./config/database');
const passport =require('passport');

let Article = require("./models/article");

mongoose.connect(config.database);
let db = mongoose.connection;

//Check conection
db.once("open", () => {
  console.log("Conected MongoDB");
});

//Check for errors
db.on("error", error => {
  console.log(error);
});

//views engine
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "pug");

//Body-parser middleware
// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }));
// parse application/json
app.use(bodyParser.json());

//set public folder
app.use(express.static(path.join(__dirname, "public")));

//Express session middleware
app.use(
  session({
    secret: "keyboard cat",
    resave: true,
    saveUninitialized: true
  })
);

//express messages middleware
app.use(require("connect-flash")());
app.use(function(req, res, next) {
  res.locals.messages = require("express-messages")(req, res);
  next();
});

//Express validator middleware
app.use(expressValidator());

//passport config
require('./config/passport')(passport);
//passport middleware
app.use(passport.initialize());
app.use(passport.session());

app.get('*',function(req,res,next){
  res.locals.user = req.user || null;
  next();
});


//Home Route
app.get("/", (req, resp) => {
  Article.find({}, (err, articles) => {
    if (err) {
      console.log(err);
    } else {
      resp.render("index", {
        title: "Articles",
        articles: articles
      });
    }
  });
});

//Route files
let articles = require("./routes/articles");
let users = require("./routes/users");
app.use("/articles", articles);
app.use("/users", users);


//Start Server
app.listen(3000, () => {
  console.log("app start in port 3000");
});
