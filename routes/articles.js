const express = require("express");
const router = express.Router();

let Article = require("../models/article");

//Add Route
router.get("/add", ensureAuthenticated, (req, resp) => {
  resp.render("add_articles", {
    title: "Add Articles"
  });
});

//Get single Article
router.get("/:id", (req, resp) => {
  Article.findById(req.params.id, (error, article) => {
    resp.render("article", {
      article: article
    });
  });
});

//Add submit  POST route
router.post("/add", (req, resp) => {
  req.checkBody("title", "Title is requierd").notEmpty();
  req.checkBody("author", "Author is requierd").notEmpty();
  req.checkBody("body", "Body is requierd").notEmpty();

  let errors = req.validationErrors();

  if (errors) {
    resp.render("add_articles", {
      title: "Add Article",
      errors: errors
    });
  } else {
    let article = new Article();
    article.title = req.body.title;
    article.author = req.body.author;
    article.body = req.body.body;

    article.save(err => {
      if (err) {
        console.log(err);
      } else {
        req.flash("success", "Article Added");
        resp.redirect("/");
      }
    });
  }
});

//Get single Article by Id
router.get("/edit/:id", (req, resp) => {
  Article.findById(req.params.id, (error, article) => {
    resp.render("edit_article", {
      title: "Edit Article",
      article: article
    });
  });
});

//Update submit  POST route
router.post("/edit/:id", (req, resp) => {
  let article = {};
  article.title = req.body.title;
  article.author = req.body.author;
  article.body = req.body.body;

  let qurery = { _id: req.id };

  Article.update(qurery, article, err => {
    if (err) {
      console.log(err);
    } else {
      resp.redirect("/");
    }
  });
});

router.delete("/:id", function(req, resp) {
  let query = { _id: req.params.id };
  Article.remove(query, err => {
    if (err) {
      console.log(err);
    }
    resp.send("Success");
  });
});

//ensure authenticated
function ensureAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  } else {
    req.flash("danger", "please login");
    res.redirect("/users/login");
  }
}

module.exports = router;
