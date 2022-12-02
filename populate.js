#! /usr/bin/env node
var async = require('async')
const bcrypt = require("bcryptjs")
var User = require('./models/User')
var Course = require('./models/course')
var Card = require('./models/card')
var Image = require('./models/Image')
var Visit = require('./models/Visit')
var Favorite = require('./models/Favorite')
const createProfilePicture = require("./utils/createProfilePicture");
require('dotenv').config();

const mongoose = require("mongoose");
const {log} = require("mercedlogger");
const { castObject } = require('./models/card')
const mongoDB = "mongodb+srv://Jonil:Jonil123@flashcardz.7w8whn4.mongodb.net/flashcardz?retryWrites=true&w=majority";
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
const db = mongoose.connection;

var users = []
var courses = []
var cards = []
var images = []
var visits = []
var favorites = []

async function userCreate(username, firstName, lastName, email, password, imageText, cb) {
  var image = await imageCreate(imageText, cb); 

  userdetail = {username:username, firstName:firstName , lastName: lastName, email:email, password:password, verified:true,profilePicture:image}
  userdetail.password = await bcrypt.hash(userdetail.password, 10);

  var user = new User(userdetail);
       
  user.save(function (err) {
    if (err) {
      cb(err, null)
      return;
    }
    console.log('New user');
    users.push(user)
    cb(null, user)
  }  );
}


async function courseCreate(name, description, code, school, creator, public, imageText, cb) {
  
  var image = await imageCreate(imageText, cb); 

  coursedetail = {name, description, code, school, creator, public ,image:image._id}

  var course = new Course(coursedetail);
       
  course.save(function (err) {
    if (err) {
      cb(err, null);
      return;
    }
    console.log('New Course');
    courses.push(course)
    cb(null, course);
  }   );
}


async function cardCreate(creatorId, courseId, title, front, back, cb) {
  carddetail = { 
    creatorId: creatorId,
    courseId: courseId,
    title: title,
    front: front,
    back: back
  }

  var card = new Card(carddetail);    
  await card.save();
}

async function imageCreate(imageText, cb) {

  var imageObject = await createProfilePicture(imageText);

  const uploadObject = new Image(imageObject);
    
  var img = await uploadObject.save();
  images.push(uploadObject);
  console.log('New Image');
  return img;
}

async function favoriteCreate(user, course) {
    favoritedetails = { 
      user: user,
      course: course
    }
  
    try{
      var favorite = new Favorite(favoritedetails);    
      await favorite.save();
      console.log("Favorite created");
    }catch{};
}

async function visitCreate(user, course) {
    visitdetails = { 
      user: user,
      course: course
    }

    try{
      var visit = new Visit(visitdetails);    
      await visit.save();
      console.log("Visited created");
    }catch{};
}

function createUsers(cb) {
    async.series([
        function(callback) {
          userCreate("Heiko.Victor","Heiko", "Victor", "Heiko.Victor@gmeel.com", "6921", "Earth reviving after human extinction", callback);
        },
        function(callback) {
          userCreate("Sara.Karaugh","Sara", "Karaugh", "Sara.Karaugh@gmeel.com", "6921", "A new beginning, nature taking over buildings", callback);
        },
        function(callback) {
          userCreate("Xander.Kenneth","Xander", "Kenneth", "Xander.Kenneth@gmeel.com", "6921", "Photo of an extremely cute alien fish swimming an alien habitable underwater planet", callback);
        },
        function(callback) {
          userCreate("Jenni.Lewin","Jenni", "Lewin", "Jenni.Lewin@gmeel.com", "6921", "Ossuary cemetary segmented shelves overgrown, graveyard", callback);
        },
        function(callback) {
          userCreate("Joey.Ferdinand","Joey", "Ferdinand", "Joey.Ferdinand@gmeel.com", "6921", "Rubber Duck Aliens visiting the Earth for the first time", callback);
        },
        function(callback) {
          userCreate("Aylmer.Wilson","Aylmer", "Wilson", "Aylmer.Wilson@gmeel.com", "6921", "Noir detective mr. Rubber Duck. Smoke, rain, moustache and bravery", callback);
        },
        function(callback) {
          userCreate("Rorie.Doria","Rorie", "Doria", "Rorie.Doria@gmeel.com", "6921", "Medieval warriors travelling on a cliff to a background castle", callback);
        },
        function(callback) {
          userCreate("Brenna.Missy","Brenna", "Missy", "Brenna.Missy@gmeel.com", "6921", "Viking north druid lich mermaid king wise old man god of death witch pagan face portrait", callback);
        },
        function(callback) {
          userCreate("Henny.Pamella","Henny", "Pamella", "Henny.Pamella@gmeel.com", "6921", "A seamless tileable jade tree pattern, spiral carvings, octane renderer", callback);
        },
        function(callback) {
          userCreate("Sophie.Nanette","Sophie", "Nanette", "Sophie.Nanette@gmeel.com", "6921", "Lovecraftian character Cthulhu, with the hunter hat, and the saw cleaver, with bloodborne weapons", callback);
        },
        ],
        // optional callback
        cb);
}

function createCourses(cb) {
    async.series([
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Webtechnologie", "In dit vak leren we werken met de principes van webtechnologie", "J012A8", "KuLeuven", creator._id, true, "Making a website with html", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Nederlands", "In dit vak leren we werken met de principes van nederlands", "J01438", "UGent", creator._id, true, "Manuscript of a foreign language", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Engels", "In dit vak leren we werken met de principes van engels", "J012A9", "HoGent", creator._id, true, "Manuscript of a foreign language", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Frans", "In dit vak leren we werken met de principes van frans", "J012B8", "KDG", creator._id, true, "Manuscript of a foreign language", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Duits", "In dit vak leren we werken met de principes van duits", "J012C8", "KDG", creator._id, true, "Manuscript of a foreign language", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Wiskunde", "In dit vak leren we werken met de principes van wiskunde", "J01DE8", "HoGent", creator._id, true, "A school board with math calculations", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Java", "In dit vak leren we werken met de principes van java", "J01C38", "UGent", creator._id, true, "Coding on a computer", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Python", "In dit vak leren we werken met de principes van python", "J01348", "HoGent", creator._id, true, "Coding on a computer", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Besturingsystemen", "In dit vak leren we werken met de principes van besturingsystemen", "J312A8", "KDG", creator._id, true, "Coding on a computer", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Electronica", "In dit vak leren we werken met de principes vab electronica", "J8C2A8", "UAntwerpen", creator._id, true, "A breadboard full of wires and leds", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Godsdienst", "In dit vak leren we werken met de principes van godsdienst", "JCP2A8", "KUB", creator._id, true, "God appearing between the cloud with the sun in the background", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Fyisca", "In dit vak leren we werken met de principes van fyisca", "J012H2", "KUB", creator._id, true, "A apple falling from a tree", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Chemie", "In dit vak leren we werken met de principes van chemie", "J012BA1", "UAntwerpen", creator._id, true, "A chemistry experiment with bottles of strange fluids", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Bouwkunde", "In dit vak leren we werken met de principes van bouwkunde", "J012VZ", "Artevelde", creator._id, true, "A pile of bricks for building houses", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Economie", "In dit vak leren we werken met de principes van economie", "J01898", "Artevelde", creator._id, true, "A vault overfilled with money and coins", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Criminologie", "In dit vak leren we werken met de principes van criminologie", "J01AZ8", "KuLeuven", creator._id, true, "A thief robbing a house", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Pilotologie", "In dit vak leren we werken met de principes van pilotologie", "J01438", "UGent", creator._id, true, "A plane flying in the clouds", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Biologie", "In dit vak leren we werken met de principes van engels", "J012A9", "HoGent", creator._id, true, "Microscoop looking at some bacteria", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Archeologie", "In dit vak leren we werken met de principes van frans", "J012B8", "KDG", creator._id, true, "A excavated dinosaur skeleton", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Geschiedenis", "In dit vak leren we werken met de principes van duits", "J012C8", "KDG", creator._id, true, "The romain empire in its prime days", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Astronomie", "In dit vak leren we werken met de principes van wiskunde", "J01DE8", "HoGent", creator._id, true, "A blackhole surround with stars", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Geologie", "In dit vak leren we werken met de principes van java", "J01C38", "UGent", creator._id, true, "A astronaut looking at the earth from the moon", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Psychlogie", "In dit vak leren we werken met de principes van python", "J01348", "HoGent", creator._id, true, "The human mind an it's nerve system", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Rechten", "In dit vak leren we werken met de principes van besturingsystemen", "J312A8", "KDG", creator._id, true, "A man in a courthouse", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Religie", "In dit vak leren we werken met de principes vab electronica", "J8C2A8", "UAntwerpen", creator._id, true, "A ancient tempel surrounded with modern buildings", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Art", "In dit vak leren we werken met de principes van godsdienst", "JCP2A8", "KUB", creator._id, true, "A table with pencils and paint", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Geneeskunde", "In dit vak leren we werken met de principes van fyisca", "J012H2", "KUB", creator._id, true, "A operating table with a syringe", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Game design", "In dit vak leren we werken met de principes van chemie", "J012BA1", "UAntwerpen", creator._id, true, "A person holding a controller", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Journalisme", "In dit vak leren we werken met de principes van bouwkunde", "J012VZ", "Artevelde", creator._id, true, "A journalist talking to the camera", callback);
        },
        function(callback) {
          var creator = users[Math.floor(Math.random()*users.length)];
          courseCreate("Marketing", "In dit vak leren we werken met de principes van economie", "J01898", "Artevelde", creator._id, true, "Wallstreet office watch the price charts", callback);
        },
        ],
        // optional callback
        cb);
}

function createCards(cb) {
  async.series([
    function(callback) {
      for(var i = 0; i < 250; i++){
        var course = courses[Math.floor(Math.random()*courses.length)];
        var creator = course.creator;
        cardCreate(creator, course._id, "Dit is een random title" + i, "Hier komt een random vraag" + i, "Hier komt een random antwoord " + i, callback);
      }
    },
    ],
    // optional callback
    cb);
}

function createVisits() {
  async.series([
    function() {
      for(var i = 0; i < 50; i++){
        var course = courses[Math.floor(Math.random()*courses.length)];
        var user = users[Math.floor(Math.random()*users.length)];
        visitCreate(user._id, course._id, callback);
      }
    },
    ]);
}

function createFavorites() {
  async.series([
    function() {
      for(var i = 0; i < 50; i++){
        var course = courses[Math.floor(Math.random()*courses.length)];
        var user = users[Math.floor(Math.random()*users.length)];
        favoriteCreate(user._id, course._id);
      }
    },
    ]);
}

Populate();
async function Populate(){
  users = await User.find({});
  courses = await Course.find({});
  async.series([
      createFavorites
  ],
  );
}
