var Card = require("../models/card");
var Course = require("../models/course");
var async = require("async");
var User = require("../models/User");
const flash = require("flash");

const { body, validationResult } = require("express-validator");

exports.card_create_get = function (req, res, next) {
    try{
        const cardCreation = req.flash("cardCreation") || [];
        if(req.user){
            async.parallel(
                {
                    courses: function (callback) {
                        Course.find(callback);
                    }
                },
                function (err, results) {
                    if (err) {
                        console.log("Card controller - error " + err);
                        return next(err);
                    }
                    
                    try{
                        var length = results.courses.length - 1;
                        for(var i = length; i >= 0; i--){
                            var course = results.courses[i];
                            if(!course.public) {
                                if(course.creator && !course.creator.equals(req.user._id)){
                                    console.log(course.creator + "  " + req.user._id);    
                                    results.courses.splice(i, 1);
                                }
                            }
                        }
                    } catch(error) {
                        console.log(error);
                    }

                    res.render("card_form", {user: req.user, courses: results.courses, cardCreation})
                }
            );
        } 
        else{ 
            // If not logged in, redirect to login. If succesfully logged in we redirect back to this page.
            req.session.redirectTo = '/cards/create';
            res.redirect("/login");
        }
    } catch(error) {
        console.log("error in cardcreation form: " + error);
    }
};

exports.card_create_post = [
    body("title", "Invalid title").escape(), 
    body("q", "Invalid question").trim().isLength({min: 1}).escape(),
    body("a", "Invalid question").trim().isLength({min: 1}).escape(),
    body("course").escape(),

    async (req, res, next) => {
        const errors= validationResult(req);

        // Check if user exists
        var user = await User.findOne({ 'username': req.user.username}, '_id');
        if(!user){
            return;
        }

        // Add card
        var card = new Card({
            title: req.body.title,
            creatorId: user._id,
            courseId: req.body.course,
            front: req.body.q,
            back: req.body.a
        });

        await card.save(function (err){
            if (err) return next(err);
            else req.flash("cardCreation","Card has been created");
        });
        
        // Increment course number index
        await Course.findOneAndUpdate({ _id: req.body.course}, {
            $inc: {
                numCards: 1
            }
        });
        
        res.redirect("/cards/create");
        return;
    },
];

exports.card = function (req, res, next) {
    Card.findById(req.params.id).exec(function (err, card) {

    })
};