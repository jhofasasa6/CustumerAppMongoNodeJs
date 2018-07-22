const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const passport = require("passport");

let User = require("../models/user");

router.get("/register", (req, resp) => {
  resp.render("register");
});

router.post("/register", (req, resp) => {
  const name = req.body.name;
  const email = req.body.email;
  const username = req.body.username;
  const password = req.body.password;
  const confirm = req.body.password2;

  req.checkBody("name", "Name is requiered").notEmpty();
  req.checkBody("email", "Email is requiered").notEmpty();
  req.checkBody("email", "Email is not valid").isEmail();
  req.checkBody("username", "UserName is requiered").notEmpty();
  req.checkBody("password", "Name is requiered").notEmpty();
  req.checkBody("password2", "Password do not match").equals(req.body.password);

  let errors = req.validationErrors();

  if (errors) {
    resp.render("register", {
      errors: errors
    });
  } else {
    let newUser = new User({
      name: name,
      email: email,
      username: username,
      password: password
    });

    bcrypt.genSalt(10, function(err, salt) {
      bcrypt.hash(newUser.password, salt, function(err, hash) {
        if (err) {
          console.log(err);
        }
        newUser.password = hash;
        newUser.save(function(err) {
          if (err) {
            console.log(err);
            return;
          } else {
            req.flash("succes", "User create succesfull");
            resp.redirect("/users/login");
          }
        });
      });
    });
  }
});

router.get("/login", function(req, resp) {
  resp.render("login");
});

router.post("/login", function(req, resp, next) {
  passport.authenticate("local", {
    successRedirect: "/",
    failureRedirect: "/users/login",
    failureFlash: true
  })(req, resp, next);
});

router.get('/logout',function(req,res){
  req.logOut();
  req.flash('succes' , 'you are logged out');
  res.redirect('/users/login');
});
module.exports = router;
