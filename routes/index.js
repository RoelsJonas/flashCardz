var express = require('express');
var router = express.Router();
var {isLoggedIn, state} = require("../controllers/middleware"); 

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'FlashCardz' });
// });
// GET home page.
router.get("/", isLoggedIn, function (req, res) {
  var user = undefined;
  if(req.user) user = req.user;
  res.render("home", { title: 'Flashcards', user: user, page: "dashboard"});
});

module.exports = router;


