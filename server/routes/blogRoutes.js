const express = require("express");
const router = express.Router();
const blogController = require("../controller/blogController");

// App routes
router.get("/", blogController.homePage); //homePage is controller name
router.get("/blogs/:id", blogController.exploreBlog);
router.get("/categories", blogController.exploreCategories);
router.get("/categories/:id", blogController.exploreCategoriesById);
router.post("/search", blogController.searchBlog);
router.get("/explore-latest", blogController.exploreLatest);
router.get("/explore-random", blogController.exploreRandom);
router.get("/submit-blog", blogController.submitBlog);
router.post("/submit-blog", blogController.submitBlogOnPost);

router.get("/about", blogController.aboutPage);
router.get("/contact", blogController.contactPage);

module.exports = router;
