var express = require("express");
var router = express.Router();

router.get("/", function(req, res, next) {
    res.cookie("authorization", "null");
    res.render('logout');
  });

module.exports = router;