var express = require('express');
var router = express.Router();

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'FlashCardz' });
// });
// GET home page.
router.get("/", function (req, res) {
  res.render("home", { title: 'Flashcards'});
});

module.exports = router;


