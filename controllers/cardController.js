var Card = require("../models/card");
const course = require("../models/course");
var async = require("async");
var User = require("../models/User");
const flash = require("flash");

const { body, validationResult } = require("express-validator");
const { author_create_post } = require("./authorController");

exports.card_create_get = function (req, res, next) {
    const cardCreation = req.flash("cardCreation") || [];
    if(req.user){
        async.parallel(
            {
                courses: function (callback) {
                    course.find(callback);
                }
            },
            function (err, results) {
                if (err) {
                    console.log("Card controller - error " + err);
                    return next(err);
                }
                res.render("card_form", {user: req.user, courses: results.courses, cardCreation})
            }
        );
    } 
    else res.redirect("/login");
};

exports.card_create_post = [
    body("title", "Invalid title").escape(), 
    body("q", "Invalid question").trim().isLength({min: 1}).escape(),
    body("a", "Invalid question").trim().isLength({min: 1}).escape(),
    body("course").escape(),

    (req, res, next) => {
        const errors= validationResult(req);
        console.log("test" + req.user);
        User.findOne({ 'username': req.user.username}, '_id', function(err, author) {
            var card = new Card({
                title: req.body.title,
                creatorId: author._id,
                courseId: req.body.course,
                front: req.body.q,
                back: req.body.a
            });
            card.save(function (err){
                if (err) return next(err);
                else req.flash("cardCreation","Card has been created");
            });
        });
        
        res.redirect("/cards/create");
        return;
    },
];

exports.card = function (req, res, next) {
    Card.findById(req.params.id).exec(function (err, card) {

    })
};