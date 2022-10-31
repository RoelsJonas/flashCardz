const jwt = require("jsonwebtoken");
const SECRET = "SECRET123";
var state = false;

const isLoggedIn = async (req, res, next) => {
    try {
      // check if auth header exists
      var cookie = req.headers.cookie;
      console.log("Cookie: " + cookie);
      var token = "null";
      if (cookie) {
        // parse token from header
        const cookies = cookie.split(' ');
        console.log(cookies);
        // const token = cookie.split(' ')[0].split("=")[1]; //split the header and get the token
        cookies.forEach(cookie => {
          const temp = cookie.split('=');
          if(temp[0] == "authorization") {
            token = temp[1];
          }
        });
        console.log("Token: " + token);
        if (token != "null"){
          if (token) {
            const payload = await jwt.verify(token, SECRET);
            if ("Payload: " +payload) {
              // store user data in request object
              console.log(payload);
              req.user = payload;
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