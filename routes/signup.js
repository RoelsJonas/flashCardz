var express = require("express");
var router = express.Router();

// const user_controller = require("../controllers/userController");

router.get("/", function(req, res, next) {
  const successes = req.flash('successes') || [];
  const errors = req.flash('errors') || [];
    res.render("signup",{ title: 'Flashcard | Signup', errors, successes});
  });

module.exports = router;