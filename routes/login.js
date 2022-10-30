var express = require("express");
const flash = require("flash");
var router = express.Router();

router.get("/", function(req, res, next) {
  const successes = req.flash('successes') || [];
  const errors = req.flash('errors') || [];
    res.render("login", { title: 'Flashcards | Login', successes, errors});
  });

module.exports = router;