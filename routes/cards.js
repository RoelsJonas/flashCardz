var express = require('express');
var router = express.Router();

const cardController = require("../controllers/cardController");
var {isLoggedIn, state} = require("../controllers/middleware");

router.get("/create", isLoggedIn, cardController.card_create_get);
router.post("/create", isLoggedIn, cardController.card_create_post);
router.get("/", isLoggedIn, function(req, res, next) {
    if(req.headers.host != "localhost:3000") {
        if(!req.secure) {
          res.redirect("https://" + req.headers.host + req.url);
          return;
        }
    }
    res.render("card_detail", {user: req.user});
});


module.exports = router;