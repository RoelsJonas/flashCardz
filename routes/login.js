var express = require("express");
const flash = require("flash");
var router = express.Router();

router.get("/", function(req, res, next) {
  const successes = req.flash('successes') || [];
  const errors = req.flash('errors') || [];
  const stored = req.flash('stored') || [];
    res.render("login", { title: 'Flashcards | Login', successes, errors, stored});
  });

module.exports = router;