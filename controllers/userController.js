const { Router } = require("express"); // import router from express
const User = require("../models/User"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens

const router = Router(); // create router to create route bundle

const SECRET = "SECRET123";

router.post("/signup", async (req, res) => {
    try {
      // hash the password
      
      console.log(req.body);
      console.log(req.body.username);
      req.body.password = await bcrypt.hash(req.body.password, 10);
      // create a new user
      console.log("test");
      const user = await User.create({
        username: req.body.username,
        password: req.body.password
      });
      console.log("test");
      // send new user as response
      res.redirect('/login');
      console.log("test");
    } catch (error) {
        console.log("Error detected");
        console.log(error);
      res.status(400).json({ error });
    }
  });

router.post("/login", async (req, res) => {
try {
    // check if the user exists
    const user = await User.findOne({ username: req.body.username });
    if (user) {
    //check if password matches
    const result = await bcrypt.compare(req.body.password, user.password);
    if (result) {
        // sign token and send it in response
        const token = await jwt.sign({ username: user.username }, SECRET);

        let options = {
            maxAge: 1000 * 60 * 15, // would expire after 15 minutes
        }

        res.cookie("authorization", token, options);
        res.redirect('/profile');
        // res.json({ token });
    } else {
        res.status(400).json({ error: "password doesn't match" });
    }
    } else {
    res.status(400).json({ error: "User doesn't exist" });
    }
} catch (error) {
    res.status(400).json({ error });
}
});

module.exports = router;