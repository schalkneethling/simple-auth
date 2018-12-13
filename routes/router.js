const express = require("express");
var router = express.Router();

const dbUtils = require("../utils/db");
const formResponses = require("../utils/form-responses");
const validate = require("../utils/validate");

router.get("/", (req, res) => {
  res.render("index");
});

router.get("/register", (req, res) => {
  res.render("register");
});

router.post("/register", (req, res) => {
  let reqBody = req.body;
  let userDetails = {
    name: reqBody.fullname,
    email: reqBody.email,
    username: reqBody.username,
    password: reqBody.password,
    passwordConfirmation: reqBody.password_conf
  };

  const isUserDetailsValid = validate.registration(userDetails);
  if (isUserDetailsValid === true) {
    dbUtils
      .registerUser(userDetails)
      .then(user => {
        res.render("register", formResponses.registrationSuccessful(user.name));
      })
      .catch(err => {
        console.error(`Error while registering user: ${err}`);
        res.send(err);
      });
  } else {
    res.render("register", {
      formFields: userDetails,
      invalidFields: isUserDetailsValid
    });
  }
});

router.get("/login", (req, res) => {
  res.render("login");
});

router.post("/login", (req, res) => {
  const reqBody = req.body;
  const loginDetails = {
    email: reqBody.email,
    password: reqBody.password
  };

  dbUtils.auth(loginDetails, response => {
    if (response && response.authError) {
      res.render("login", { authError: response });
    } else {
      res.render("profile", { user: response });
    }
  });
});

router.get("/logout", (req, resp) => {
  if (req.session) {
    // destroy the session
    req.session.destroy(err => {
      console.error(err);
    });
  } else {
    res.redirect("/");
  }
});

module.exports = router;
