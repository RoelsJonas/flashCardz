const jwt = require("jsonwebtoken");
const SECRET = "SECRET123";
var state = false;

const isLoggedIn = async (req, res, next) => {
    try {
      // check if auth header exists
      var cookie = req.headers.cookie;
      console.log("Cookie: " + cookie);
      if (cookie) {
        // parse token from header
        const token = cookie.split(' ')[1].split("=")[1]; //split the header and get the token
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
        } else next();
      } else {
        // res.status(400).json({ error: "No authorization header" });
        res.redirect('/login');
      }
      
      
    } catch (error) {
      res.status(400).json({ error });
    }
  };

  module.exports = {isLoggedIn, state};