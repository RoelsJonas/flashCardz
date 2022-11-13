var Course = require("../models/course");
var User = require("../models/User");
var {isLoggedIn, state} = require("../controllers/middleware");
const Card = require("../models/card");


exports.course_list = function (req, res, next) {
    if(req.query){
        if(req.query.searchTerm){
            Course.find({'name': new RegExp(req.query.searchTerm, 'i')}).exec(function (err, courses) {
                res.render("course_list", {course_list: courses, user:req.user})
            });
            return;
        }
    }
    Course.find({}, "name code school")
        .sort("name")
        .exec(function (err, list_courses) {
            if (err) return next(err);
            else res.render("course_list", {course_list: list_courses, user: req.user});
        });
};


exports.course_create_get = function (req, res, next) {
    if(req.user)
    res.render("course_form", {user: req.user});
    else res.redirect("/login");
};

exports.course_create_post = function(req, res, next){
    User.findOne({ 'username': req.user.username}, '_id', function(err, author) {
        var course = new Course({
            name: req.body.name,
            description: req.body.description,
            code: req.body.code,
            school: req.body.school,
            creator: author
        });
        course.save(function (err){
            if (err) return next(err);
            res.redirect('/courses');
        });
    });
};

exports.course_detail = function(req, res, next) {
    Course.findById(req.params.id).exec(function (err, course) {
        if (err) return next(err);
        if (course == null) {
            var err = new Error("Cou7rse not found");
            err.status = 404;
            return next(err);
        }
        User.findById(course.creator).exec(function (err, user){
            if (err) return next(err);
            var username = ""
            if(user != null) username = user.username;
            res.render("course_detail", {
                course: course,
                creator: username,
                user: req.user
            })
        });
    });
};

exports.course_cards = function (req, res, next) {
    Card.find({courseId: req.params.id}).exec(function (err, cards) {
        res.status(200).json(cards);
    });
}