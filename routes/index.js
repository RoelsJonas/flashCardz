var express = require('express');
var router = express.Router();
var {isLoggedIn, state} = require("../controllers/middleware"); 

router.get("/", isLoggedIn, function (req, res) {
  if(req.headers.host != "localhost:3000") {
    if(!req.secure) {
      res.redirect("https://" + req.headers.host + req.url);
      return;
    }
  }
  var user = undefined;
  if(req.user) user = req.user;
  res.render("home", { title: 'Flashcards', user: user, page: "dashboard"});
});

module.exports = router;


