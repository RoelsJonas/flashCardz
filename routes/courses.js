var express = require('express');
var router = express.Router();

const courseController = require("../controllers/courseController");
var {isLoggedIn, state} = require("../controllers/middleware");

/* GET home page. */
router.get('/', isLoggedIn, courseController.course_list);

router.get("/create", isLoggedIn, courseController.course_create_get);

router.post("/create", isLoggedIn, courseController.course_create_post);


router.get("/course:id", isLoggedIn, courseController.course_detail);

module.exports = router;