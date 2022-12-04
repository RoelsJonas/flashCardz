var Course = require("../models/course");
var User = require("../models/User");
var {isLoggedIn, state} = require("../controllers/middleware");
const Card = require("../models/card");
const async = require("async");
const Favorite = require("../models/Favorite");
const Visit = require("../models/Visit");
const createProfilePicture = require("../utils/createProfilePicture");
const Image = require("../models/Image");
require('mongoose-query-random');

exports.course_personal_list = async (req, res, next) => {
    // If not logged in, go to login page and redirect after
    if(!req.user){
        req.session.redirectTo = '/courses/personal';
        res.redirect("/login");
        return;
    } 
    
    // Find all the courses that are private and have this users creator id, or are public and are from this user
    // Next find all favorites and populate these courses, do the same for recents
    courses = await Course.find({creator: req.user._id})
        .sort("name");
    favorites = await Favorite.find({user: req.user._id}, "course")
        .populate("course");
    recents = await Visit.find({user: req.user._id})
        .sort("-createdAt")
        .limit(6)
        .populate("course");
    
    const successes = req.flash('successes') || [];
    const errors = req.flash('errors') || [];
    const stored = req.flash('stored') || [];
    res.render("course_personal_list", {course_list: courses, favorites, recents, successes, errors, stored , user: req.user, page: "courses"});
};

exports.course_public_list = async (req, res, next) => {
    // If not logged in, go to login page and redirect after
    if(!req.user){
        req.session.redirectTo = '/courses/public';
        res.redirect("/login");
        return;
    } 

    // Get vars geven in the request
    var searchType = req.query.searchType || "name";
    var searchItem = req.query.searchItem || "name";
    console.log(searchType + "  " + searchItem);

    const successes = req.flash('successes') || [];
    const errors = req.flash('errors') || [];
    const stored = req.flash('stored') || [];

    // If there is a search
    if(req.query){
        if(req.query.searchTerm){
            // Find all the courses that are private and have this users creator id and also have the same name as the searchterm
            var query =   {
                $and: [
                    {"public":true},
                    {[searchType]: new RegExp(req.query.searchTerm, 'i')}
            ]};
            courses = await Course.find(query)         
                .sort(searchItem)
                .limit(3);
                        
            count = await Course.count(query);
            favorites = await Favorite.find({user: req.user._id}, "course");
            res.render("course_public_list", {course_list: courses, favorites, user:req.user, count, successes, errors, stored, page: "courses"})
            return;
        }
    }
    
    // Find all the courses that are public, also get favorites
    courses = await Course.find({"public":true})      
        .sort(searchItem)
        .limit(3);
    count = await Course.count({"public":true});
    favorites = await Favorite.find({user: req.user._id}, "course");
    res.render("course_public_list", {course_list: courses, favorites, user: req.user, count, successes, errors, stored, page: "courses"});
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
    res.render("course_form", {title: 'Flashcards | Course', successes, errors, stored, page: "courses"});

};

exports.course_create_post = async function(req, res, next){
    try{

        var imageObject = await createProfilePicture(req.body.image);
        console.log(imageObject);
        const uploadObject = new Image(imageObject);
        let picture = await uploadObject.save();
        User.findOne({ 'username': req.user.username}, '_id', function(err, author) {
            var course = new Course({
                name: req.body.name,
                description: req.body.description,
                code: req.body.code,
                school: req.body.school,
                creator: author,
                public: req.body.public ? true : false,
                image: picture._id,
            });
            course.save(function (err){
                if (err) return next(err);
                req.flash("successes","Course created");
                res.redirect('/courses/personal');
            });
        });
    } catch {
        res.render("course_form", {user: req.user, errors: ["Something went wrong"], successes: [], stored: [], page: "courses"});
    }
};


exports.course_get_details = async (req, res, next) => {

    // Check if provided user is valid
    var thisUser = await User.findById(req.params.uid);
    if(!thisUser){
        res.sendStatus(400);
        console.log("No user found");
        return;
    } 

    var course = await Course.findById(req.params.cid);
    if(!course){
        res.sendStatus(400);
        console.log("No course found");
        return
    }

    var user = await User.findById(course.creator);
    if(!user){
        res.sendStatus(400);
        console.log("Creator user not found");
        return;
    }

    //If this course is private and this is another user, it shouldn't be accessible
    if(!course.public && !course.creator.equals(req.params.uid)){
        res.sendStatus(400);
        console.log("User tried to acces private course");
        return;
    }

    // Check if user already visited this course
    var old_visit = await Visit.findOne({user: thisUser._id, course: course._id});
    if(old_visit){
        await Visit.findOneAndUpdate({ _id: old_visit._id}, {
            createdAt: Date.now()
        });

        console.log("Updated visitor")
    }
    else{
        var visit = new Visit({
            user:  thisUser._id,
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
    var courseInfo = {
        course: course,
        creator: username
    }
    res.json(courseInfo);

};

exports.course_cards = async function (req, res, next) {
    Card.find({courseId: req.params.id}).random(parseInt(req.params.quantity), true, function(err, cards) {
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

        //If this course is private and this is another user, it shouldn't be accessible
        if(!course.public && !course.creator.equals(req.params.uid)){
            res.sendStatus(400);
            console.log("Couldn't add to favorites");
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
    var searchType = req.body.searchType || "name";
    var searchItem = req.body.searchItem || "name";
    var skip = req.body.skip || 0;
    var limit = req.body.limit || 9;
    var search = req.body.search || "";
    console.log(searchType + "  " + searchItem);

    
    // If there is a search
    if(search){
        courses = await Course.find(
            // Find all the courses that are public and have the same name as the searchterm
            {
                $and: [
                    {"public":true},
                    {[searchType]: new RegExp(req.body.searchTerm, 'i')}
            ]})
        .lean()
        .sort(searchItem)
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
        .sort(searchItem)
        .skip(skip)
        .limit(limit);
    
    // Send the response back as JSON
    res.json(courses);
};


exports.course_delete_get = async (req, res) => {

    var course = await Course.findById(req.params.id);
    if(course){
        var creator = await User.findById(course.creator);
        if(creator) {
            if(creator.username != req.user.username) {
                res.status(400).json("Access denied");
                return;
            }
            res.render("course_delete", {course: course, title: 'Flashcards | Delete', page: "courses", page: "courses"});
        }
        else{
            res.status(400).json("Creator not found");
        }
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
      if(course.image){
        await Image.findByIdAndRemove(course.image);
      }
      
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
    if(!req.user) {
        res.redirect("/login");
        return;
    }
    var course = await Course.findById(req.params.id);
    if(course){
        var creator = await User.findById(course.creator);
        if(creator) {
            if(creator.username != req.user.username) {
                res.status(400).json("Access denied");
                return;
            }
            const successes = req.flash('successes') || [];
            const errors = req.flash('errors') || [];
            const stored = req.flash('stored') || [];
            res.render("course_update", {course: course, title: 'Flashcards | Update Course', successes, errors, stored,page: "courses"});
        }
        else {
            res.status(400).json("Creator not found")
        }
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

        // If you change the course from public to private delete all favorites and visits of other users
        if(course.public == true && input.public == false){
            await Favorite.deleteMany({ course: req.params.id, user: { $ne: req.user._id }});
            await Visit.deleteMany({ course: req.params.id, user: { $ne: req.user._id }});
        }
            
        // Update the course 
        await Course.findOneAndUpdate({ _id: req.params.id}, input);
        req.flash("successes","Your course got updated succesfully");
        res.redirect("/courses/" + course._id + "/update");    
        
    }catch (error) {
        res.status(400).json({ error });
    }
  };

// Get the course image
exports.course_image_get = async (req, res) => {
    if(!req.user) {
        res.redirect("/login");
        return;
    }
    try{
      let img = await Image.findOne({_id: req.params.id});
      if(!img){
        res.status(400).json("No course picture found!");
      }
  
      res.contentType(img.file.contentType);
      res.send(img.file.data);
    }
    catch (error) {
      console.log("Error detected");
      console.log(error);
      res.status(400).json({ error });
    }
};
  