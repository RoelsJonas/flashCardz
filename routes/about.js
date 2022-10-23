var express = require('express');
var {isLoggedIn, state} = require("../controllers/middleware");
var router = express.Router();

/* GET home page. */
router.get('/', isLoggedIn, function(req, res, next) {
  res.render('about', { title: 'FlashCardz' , username : req.user.username});
});

module.exports = router;