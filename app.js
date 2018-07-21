const express = require("express");
const app = express();
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require('body-parser')
let Article = require("./models/article");

mongoose.connect("mongodb://localhost/nodeKb");
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
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

//set public folder
app.use(express.static(path.join(__dirname,'public')))

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

//Add Route
app.get("/articles/add", (req, resp) => {
  resp.render("add_articles", {
    title: "Add Articles"
  });
});

//Get single Article
app.get('/article/:id',(req,resp) => {
  
  Article.findById(req.params.id, (error, article) => {
    resp.render('article',{
      article: article
    })    
  });
});

//Add submit  POST route
app.post("/articles/add", (req, resp) => {
  let article  = new Article();
  article.title =  req.body.title;
  article.author =  req.body.author;
  article.body =  req.body.body;

  article.save((err)=>{
    if(err){
      console.log(err);
    }
    else{      
      resp.redirect('/');
    }
  })  
});


//Start Server
app.listen(3000, () => {
  console.log("app start in port 3000");
});
