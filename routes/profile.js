var express = require("express");
var router = express.Router();
var {isLoggedIn, state} = require("../controllers/middleware");

router.get("/", isLoggedIn, function(req, res, next) {
    res.render("profile", {user : req.user});
  });

module.exports = router;