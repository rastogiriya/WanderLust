const express = require('express');
const router = express.Router();
const recipeController = require('../controller/recipeController');

// App routes
router.get('/', recipeController.homePage); //homePage is controller name
router.get('/blogs/:id', recipeController.exploreBlog); 
router.get('/categories', recipeController.exploreCategories);
router.get('/categories/:id', recipeController.exploreCategoriesById);
router.post('/search', recipeController.searchBlog);
router.get('/explore-latest', recipeController.exploreLatest);
router.get('/explore-random', recipeController.exploreRandom);
router.get('/submit-blog', recipeController.submitBlog);
router.post('/submit-blog', recipeController.submitBlogOnPost);

module.exports = router;