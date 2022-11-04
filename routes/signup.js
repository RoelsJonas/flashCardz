var express = require("express");
var router = express.Router();

// const user_controller = require("../controllers/userController");

router.get("/", function(req, res, next) {
  const successes = req.flash('successes') || [];
  const errors = req.flash('errors') || [];
  const stored = req.flash('stored') || [];
    res.render("signup",{ title: 'Flashcard | Signup', errors, successes, stored});
  });
  

module.exports = router;