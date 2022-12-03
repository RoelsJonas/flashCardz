var express = require('express');
var router = express.Router();

const courseController = require("../controllers/courseController");
var {isLoggedIn, state} = require("../controllers/middleware");

/* GET home page. */
router.get('/personal', isLoggedIn, courseController.course_personal_list);
router.get('/public', isLoggedIn, courseController.course_public_list);

router.get("/create", isLoggedIn, courseController.course_create_get);

router.post("/create", isLoggedIn, courseController.course_create_post);

router.get("/course_details/:cid/:uid", isLoggedIn, courseController.course_get_details);

router.get("/cards/:id/:quantity", courseController.course_cards);

router.post("/favorite/:cid/:uid", courseController.course_favorite_post);

router.post("/public/load-more", courseController.course_load_more);

router.get("/:id/delete", isLoggedIn, courseController.course_delete_get);
router.post("/:id/delete", isLoggedIn, courseController.course_delete_post);

router.get("/:id/update", isLoggedIn, courseController.course_update_get);
router.post("/:id/update", isLoggedIn, courseController.course_update_post);

router.get("/image/:id", isLoggedIn, courseController.course_image_get);

module.exports = router;