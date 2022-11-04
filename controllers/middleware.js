const jwt = require("jsonwebtoken");
const SECRET = "SECRET123";
var User = require("../models/User");
var state = false;

const isLoggedIn = async (req, res, next) => {
    try {
      // check if auth header exists
      var cookie = req.headers.cookie;
      console.log("Cookie: " + cookie);
      var token = "null";
      if (cookie) {
        // parse token from header
        const cookies = cookie.split('; ');
        console.log(cookies);
        // const token = cookie.split(' ')[0].split("=")[1]; //split the header and get the token
        cookies.forEach(cookie => {
          const temp = cookie.split('=');
          if(temp[0] == "authorization") {
            token = temp[1];
            return;
          }
        });
        console.log("Token: " + token);
        if (token != "null"){
          if (token) {
            const payload = await jwt.verify(token, SECRET);
            if (payload) {
              
              //Get the full user
              var user = await User.findOne({ username: payload.username}); //.populate("profilePicture");
              if(!user){
                return res.status(400).json({ error: "User not found in middleware.js" });
              }
              req.user = user;
              state = true;
              next();
              
            } else {
              res.status(400).json({ error: "token verification failed" });
            }
          } else {
            res.status(400).json({ error: "malformed auth header" });
          }
        } else {
          console.log("Next");
          next();
        } 
      } else {
        // res.status(400).json({ error: "No authorization header" });
        res.redirect('/login');
      }
      
      
    } catch (error) {
      console.log("Error " + error);
      res.status(400).json({ error });
    }
  };

  module.exports = {isLoggedIn, state};