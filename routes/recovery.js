const { Router } = require("express"); // import router from express
const User = require("../models/User"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const Token = require("../models/Token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const router = Router(); // create router to create route bundle

router.get("/", function(req, res, next) {
    const successes = req.flash('successes') || [];
    const errors = req.flash('errors') || [];
      res.render("recoveryRequest",{ title: 'Flashcard | Recovery', errors, successes});
    });
  
// When we post a recovey request form
router.post("/", async (req, res) => {
    try {
        
        // Check if the user exists using the provided email, if not so prompt with error
        const user = await User.findOne({ email: req.body.email});
        if(!user) {
          req.flash("errors","No user found for " + req.body.email);
          res.redirect("/recovery")
          return;
        } 
  
        //Check if the token exists, if not so make a new token
        let token = await Token.findOne({userId: user._id});
        if (!token){
            token = await Token.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
            });
  
        } 
  
        //Use the token and user to create an url, then sent this via a mail
        const url = `${process.env.BASE_URL}recovery/${user._id}/${token.token}/`;
        await sendEmail(user.email, "Password Reset","recoveryEmailTemplate", {url: url, username: user.username});   
        console.log("Recovery email has been sent");
        
        // Redirect user to recovery request page and prompt with succes
        req.flash("successes","Sent a recovery mail to " + req.body.email);
        res.redirect("/recovery")
  
    } catch (error) {
        res.status(400).json({ error });
    }
    });
  

// When we open a recovery link
router.get("/:id/:token", async (req, res) => {
	try {

    //Check if the user exists, if not so this is a invalid link and redirect to invalid page
	const user = await User.findOne({ _id: req.params.id });
	if (!user){ 
      res.render("recoveryInvalid", { title: "Flashcards | Invalid" });
      console.log("Invalid recovery link provided");
      return;
    }

    //Check if the token exists, if not so this is a invalid link and redirect to invalid page
    const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
    });
    if (!token){
      res.render("recoveryInvalid", { title: "Flashcards | Invalid" });
      console.log("Invalid recovery link provided");
      return;
    }

    //Render to the recovery page 
    res.render("recovery", { title: "Flashcards | Recovery" });
	} catch (error) {
		console.log("Internal Server Error");
	}
});

// Post the new password for recovery
router.post("/:id/:token", async (req, res) => {
	try {

    //Check if the user exists, if not so something went very wrong
	const user = await User.findOne({ _id: req.params.id });
	if (!user){ 
      req.flash("errors","User not found");
      res.redirect("/signup")
      return;
    }

    //Check if the token exists, if not so something went very wrong
    const token = await Token.findOne({
        userId: user._id,
        token: req.params.token,
    });
    if (!token){
      req.flash("errors","Token for recovery not found");
      res.redirect("/signup")
      return;
    }

    // Since these tokens are also opened via mail and are the same for recovery and verification,
    // the user also opened this via mail so we set him as verified. We also adjust the new password.
    // After that remove the token 
    const password = await bcrypt.hash(req.body.password, 10);
    await User.updateOne({ _id: user._id}, {verified: true, password: password});
	await token.remove();

    // Everything went well, redirect to login page and prompt with succes alert
    console.log("Password succesfully recovered");
    req.flash("successes","Password succesfully recovered");
    res.redirect("/login")
	} catch (error) {
		console.log("Internal Server Error");
	}
});

module.exports = router;
