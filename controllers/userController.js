const { Router } = require("express"); // import router from express
const User = require("../models/User"); // import user model
const bcrypt = require("bcryptjs"); // import bcrypt to hash passwords
const jwt = require("jsonwebtoken"); // import jwt to sign tokens
const Token = require("../models/Token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");
const createProfilePicture = require("../utils/createProfilePicture");

const multer = require('multer');
const Image = require("../models/Image");
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

const router = Router(); // create router to create route bundle

const SECRET = "SECRET123";

// Post signup form
router.post("/signup", upload.single("profilepicture") , async (req, res) => {
    try {

      // Check if this user already exists with username, if so prompt with error message
      let user = await User.findOne({ username: req.body.username });
      let input = {
        username: req.body.username,
        firstName: req.body.firstname,
        lastName: req.body.lastname,
        email: req.body.email,
        password: req.body.password,
        profilepicture: req.body.profilePicture,
        generatesentence: req.body.generatesentence
      };
      if (!user) {

        // Check if this user already exists with email adres
        user = await User.findOne({ email: input.email });
        if (!user) {
          // Hash the password
          input.password = await bcrypt.hash(input.password, 10);
          
          //If user provide a profile picture then make a image Object from is
          var imageObject;
          if(req.file){
            // Create a Image object to add to the db and link it to the user
            imageObject = {
              file: {
                data: req.file.buffer,
                contentType: req.file.mimetype
              },
              fileName: req.file.originalname
            };
          }
          //If user didn't provide a profile picture generate one yourself.
          else if(input.generatesentence != null && input.generatesentence != ""){
            imageObject = await createProfilePicture(input.generatesentence);
          }
          // If no type of profile picture is provided return error
          else{
            req.flash("errors","No type of profile picture provided, upload file or fill in sentence!");
            req.flash("stored", input);
            res.redirect("/signup");
            return;
          }
          //Upload image object to database and link it to the user
          const uploadObject = new Image(imageObject);
          let image = await uploadObject.save();
          input.profilePicture = image._id;

          // Create a new user
          let user = await User.create(input);
          
          // Create a token for mail verification
          const token = await Token.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
          });

          // Create a url and send it via mail
          const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
          await sendEmail(user.email, "Confirm Email","verifyEmailTemplate", {url: url, username: user.username});
          console.log("Verification email has been sent");
          
          // Redirect to login page and prompt user with succes
          req.flash("successes","An email has been sent, please verify");
          res.redirect("/login");
        }
        else{
          req.flash("errors","User with email "+req.body.email+" already exists");
          req.flash("stored", input);
          res.redirect("/signup")
        }
      }
      else{
        req.flash("errors","User with username "+req.body.username+" already exists");
        req.flash("stored", input);
        res.redirect("/signup")
      }
    } catch (error) {
        console.log("Error detected");
        console.log(error);
      res.status(400).json({ error });
    }
  });

//TEMP
router.get("/image/:id/", async (req, res, next) => {
  try{
    let img = await Image.findOne({_id: req.params.id});
    if(img){
      res.contentType(img.file.contentType);
      res.send(img.file.data);
    }
    else{

    }
  }
  catch (error) {
    console.log("Error detected");
    console.log(error);
    res.status(400).json({ error });
  }
});


// Post the login form
router.post("/login", async (req, res) => {
try {
    
    // Check if the user exists, if not so prompt user with error message
    const user = await User.findOne({ username: req.body.username });
    if (user) {
      
      // Check if password matches, if not so prompt user with error message
      const result = await bcrypt.compare(req.body.password, user.password);
      if (!result) {
        req.flash("errors","Password and email don't match");
        req.flash("stored", { username: req.body.username} );
        res.redirect("/login")
        return;
          
      }

      // Check if the user is already verified
      if (!user.verified){

        //Check if there is already a token, if not create a new one and send a new mail
        let token = await Token.findOne({ userId: user._id});
        if(!token){
          const token = await Token.create({
            userId: user._id,
            token: crypto.randomBytes(32).toString('hex')
          });
          console.log("Created token");
          const url = `${process.env.BASE_URL}user/${user._id}/verify/${token.token}`;
          await sendEmail(user.email, "Confirm Email","verifyEmailTemplate", {url: url, username: user.username});

          console.log("Verification email has been sent");
          req.flash("successes","An email has been sent, please verify");
        }
        else{
          req.flash("errors","Your account hasn't been verified yet, please check your emails");
        }
        req.flash("stored", { username: req.body.username} );
        res.redirect("/login")
        return;
      }

      // sign token and send it in response
      const token = await jwt.sign({ username: user.username }, SECRET);
      let options = {
          maxAge: 1000 * 60 * 15, // would expire after 15 minutes
      }
      res.cookie("authorization", token, options);

      //Redirect back to previous page, if none is selected to profile page
      var redirectTo = req.session.redirectTo || '/profile';
      delete req.session.redirectTo;
      res.redirect(redirectTo);
    } 
    else {
      req.flash("errors","User doens't exist");
      res.redirect("/login")
      return;
    }
} catch (error) {
    res.status(400).json({ error });
}
});

// When opening mail verification link
router.get("/:id/verify/:token/", async (req, res) => {
	try {

    //Check if the user exists, if not so this is a invalid link and redirect to invalid page
		const user = await User.findOne({ _id: req.params.id });
		if (!user){ 
      res.render("verifyEmailInvalid", { title: "Flashcards | Invalid" });
      console.log("Invalid verification link provided");
      return;
    }

    //Check if the token exists, if not so this is a invalid link and redirect to invalid page
		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
		if (!token){
      res.render("verifyEmailInvalid", { title: "Flashcards | Invalid" });
      console.log("Invalid verification link provided");
      return;
    }

    // Update the user to verified and remove the token
		await User.updateOne({ _id: user._id}, {verified: true });
		await token.remove();

    // Open the verified page to let the user know
		console.log("Email verified successfully");
    res.render("verifyEmail", { title: "Flashcards | Verified" });
	} catch (error) {
		console.log("Internal Server Error");
	}
});

module.exports = router;
