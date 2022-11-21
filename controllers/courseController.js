var Course = require("../models/course");
var User = require("../models/User");
var {isLoggedIn, state} = require("../controllers/middleware");
const Card = require("../models/card");
const async = require("async");
const Favorite = require("../models/Favorite");
const Visit = require("../models/Visit");


exports.course_personal_list = async (req, res, next) => {
    // If not logged in, go to login page and redirect after
    if(!req.user){
        req.session.redirectTo = '/courses/personal';
        res.redirect("/login");
        return;
    } 
    
    // Find all the courses that are private and have this users creator id, or are public and are from this user
    // Next find all favorites and populate these courses, do the same for recents
    courses = await Course.find({
        $or: [
            {"public":true, "creator": req.user._id},
            {"public": false}
    ]})
        .sort("name");
    favorites = await Favorite.find({user: req.user._id}, "course")
        .populate("course");
    recents = await Visit.find({user: req.user._id})
        .sort("-createdAt")
        .limit(6)
        .populate("course");

    res.render("course_personal_list", {course_list: courses, favorites: favorites, recents: recents , user: req.user});
};

exports.course_public_list = async (req, res, next) => {
    // If not logged in, go to login page and redirect after
    if(!req.user){
        req.session.redirectTo = '/courses/public';
        res.redirect("/login");
        return;
    } 

    // If there is a search
    if(req.query){
        if(req.query.searchTerm){
            // Find all the courses that are private and have this users creator id and also have the same name as the searchterm
            var query =   {
                $and: [
                    {"public":true},
                    {'name': new RegExp(req.query.searchTerm, 'i')}
            ]};
            courses = await Course.find(query)         
                .sort("name")
                .limit(3);
                        
            count = await Course.count(query);
            favorites = await Favorite.find({user: req.user._id}, "course");
            res.render("course_public_list", {course_list: courses, favorites: favorites, user:req.user, count: count})
            return;
        }
    }
    
    // Find all the courses that are public, also get favorites
    courses = await Course.find({"public":true})      
        .sort("name")
        .limit(3);
    count = await Course.count({"public":true});
    favorites = await Favorite.find({user: req.user._id}, "course");
    res.render("course_public_list", {course_list: courses, favorites: favorites, user: req.user, count: count});
};

exports.course_create_get = function (req, res, next) {
    // If not logged in, go to login page and redirect after
    if(!req.user){
        req.session.redirectTo = '/courses/create';
        res.redirect("/login");
        return;
    } 

    const successes = req.flash('successes') || [];
    const errors = req.flash('errors') || [];
    const stored = req.flash('stored') || [];
    res.render("course_form", {title: 'Flashcards | Course', successes, errors, stored});

};

exports.course_create_post = function(req, res, next){
    try{
        
        User.findOne({ 'username': req.user.username}, '_id', function(err, author) {
            var course = new Course({
                name: req.body.name,
                description: req.body.description,
                code: req.body.code,
                school: req.body.school,
                creator: author,
                public: req.body.public ? true : false
            });
            course.save(function (err){
                if (err) return next(err);
                res.redirect('/courses/personal');
            });
        });
    } catch {
        res.render("course_form", {user: req.user, err: "Error creating course"});
    }
};

exports.course_detail = async (req, res, next) => {
    // If not logged in, go to login page and redirect after
    if(!req.user){
        req.session.redirectTo = '/courses/course' + req.params.id;
        res.redirect("/login");
        return;
    } 

    var course = await Course.findById(req.params.id);
    if(!course){
        var err = new Error("Course not found");
        err.status = 404;
        return next(err);
    }

    var user = await User.findById(course.creator);
    if(!user){
        var err = new Error("User not found");
        err.status = 404;
        return next(err);
    }

    // Check if user already visited this course
    var old_visit = await Visit.findOne({user: course.creator, course: course._id});
    if(old_visit){
        await Visit.findOneAndUpdate({ _id: old_visit._id}, {
            createdAt: Date.now()
        });

        console.log("Updated visitor")
    }
    else{
        var visit = new Visit({
            user: course.creator,
            course: course._id,
        });
        await visit.save();

        await Course.findOneAndUpdate({ _id: course._id}, {
            $inc: {
                numVisits: 1
            }
        });

        console.log("Added visitor")
    }

    var username = user.username;
    res.render("course_detail", {
        course: course,
        creator: username,
        user: req.user,
    })

};

exports.course_cards = function (req, res, next) {
    Card.find({courseId: req.params.id}).exec(function (err, cards) {
        res.status(200).json(cards);
    });
}

exports.course_favorite_post = async (req, res, next) => {
    try{
        // Check if provided course is valid
        var course = await Course.findById(req.params.cid);
        if(!course){
            res.sendStatus(400);
            console.log("No course found");
            return;
        }

        // Check if provided user is valid
        var user = await User.findById(req.params.uid);
        if(!user){
            res.sendStatus(400);
            console.log("No user found");
            return;
        }

        var favorited = req.body.favorited ? true : false;
        // Add this to favoritess
        if(favorited){
            // Add the new favorite to the database
            var favorite = new Favorite({
                user: req.params.uid,
                course: req.params.cid,
            });
            favorite.save(function (err){
                if(err){
                    console.log(err);
                }
            });

            // Increment course number index
            await Course.findOneAndUpdate({ _id: req.params.cid}, {
                $inc: {
                    numFavorites: 1
                }
            });

            // Sent succes message to server and client
            console.log("Succesfully added to favorites");
            res.sendStatus(200);
        }
        // Delete this from favorites
        else{
            // Delete favorites with these values
            var favorite = await Favorite.deleteOne({user: req.params.uid, course: req.params.cid});
            
            // Decrement course number index
            await Course.findOneAndUpdate({ _id: req.params.cid}, {
                $inc: {
                    numFavorites: -1
                }
            });
            // Sent succes message to server and client
            console.log("Succesfully removed from favorites");
            res.sendStatus(200);
        }
    } catch {
        res.sendStatus(400);
        console.log("Something went wrong while adding to favorites");
    }
};

exports.course_load_more = async (req, res) => {
  
    // Get vars geven in the request
    var filter = req.body.filter || "name";
    var skip = req.body.skip || 0;
    var limit = req.body.limit || 9;
    var search = req.body.search || "";

    // If there is a search
    if(search){
        courses = await Course.find(
            // Find all the courses that are public and have the same name as the searchterm
            {
                $and: [
                    {"public":true},
                    {'name': new RegExp(req.query.searchTerm, 'i')}
            ]})
        .lean()
        .sort(filter)
        .skip(skip)
        .limit(limit);

        // Send the response back as JSON
        res.json(courses);
        return;
    }
    
    // Find all the courses that are public, 
    // Lean: is way faster, gives back a id instead of the whole docu while searching, can't use virtuals etc...
    // Sort: sort on the given filter
    // Skip: don't fetch all the courses again, only the next once in the list
    // Limit: only fetch a certain amount of courses
    courses = await Course.find({"public":true})    
        .lean()
        .sort(filter)
        .skip(skip)
        .limit(limit);
    
    // Send the response back as JSON
    res.json(courses);
};


exports.course_delete_get = async (req, res) => {

    var course = await Course.findById(req.params.id);
    if(course){
      res.render("course_delete", {course: course, title: 'Flashcards | Delete'});
    }
    else{
      res.status(400).json("Course not found");
    }
  
  };
  
exports.course_delete_post = async (req, res) => {
    try {
  
      // Get the course
      var course = await Course.findById(req.params.id);
      if(!course){
        req.flash("errors","Oops something went wrong, course not found!");
        res.redirect("/courses/personal");
        return;
      }
      
      // Delete image of the course
      await Image.findByIdAndRemove(course.image);
      
      // Delete cards of the course
      await Card.deleteMany({ courseId: req.params.id});

      // Delete all visited and favorited from users
      await Favorite.deleteMany({ course: req.params.id});
      await Visit.deleteMany({ course: req.params.id});

      // Delete the course 
      await Course.findByIdAndRemove(req.params.id);
      req.flash("successes","Your course has succesfully been deleted");
      res.redirect("/courses/personal");    
        
    }catch (error) {
        res.status(400).json({ error });
    }
  };
  

  exports.course_update_get = async (req, res) => {

    var course = await Course.findById(req.params.id);
    if(course){
      const successes = req.flash('successes') || [];
      const errors = req.flash('errors') || [];
      const stored = req.flash('stored') || [];
      res.render("course_update", {course: course, title: 'Flashcards | Update Course', successes, errors, stored});
    }
    else{
      res.status(400).json("Course not found");
    }
  
  };
  
  
  exports.course_update_post = async (req, res) => {
    try {
  
        // Get the course
        var course = await Course.findById(req.params.id);
        if(!course){
        req.flash("errors","Oops something went wrong, course not found!");
        res.redirect("/courses/personal");
        return;
        }

        //Get input
        var input = {
            name: req.body.name,
            description: req.body.description,
            code: req.body.code,
            school: req.body.school,
            public: req.body.public ? true : false,
        };
            
        // Update the course 
        await Course.findOneAndUpdate({ _id: req.params.id}, input);
        req.flash("successes","Your course got updated succesfully");
        res.redirect("/courses/" + course._id + "/update");    
        
    }catch (error) {
        res.status(400).json({ error });
    }
  };