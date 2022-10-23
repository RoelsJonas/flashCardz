var express = require("express");
var router = express.Router();

// const user_controller = require("../controllers/userController");

router.get("/", function(req, res, next) {
    res.render("signup");
  });

module.exports = router;