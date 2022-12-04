var express = require("express");
const flash = require("flash");
var router = express.Router();
require('dotenv').config();

router.get("/", function(req, res, next) {
  console.log(req.protocol); 
  if(req.headers.host != "localhost:3000") {
    if(req.headers['x-forwarded-proto'] !== "https") {
      res.redirect("https://" + req.headers.host + "/login");
      return
    }
  } 
  const successes = req.flash('successes') || [];
  const errors = req.flash('errors') || [];
  const stored = req.flash('stored') || [];
  res.render("login", { title: 'Flashcards | Login', successes, errors, stored});
  });


module.exports = router;