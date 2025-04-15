const express = require('express');
const router = express.Router();

const recipeController = require('../controller/recipeControl');
const authenticate = require('../middleware/authentication');
const upload = require('../middleware/upload');

router.get('/share-a-recipe', recipeController.getRecipePostPage);
router.post('/share-a-recipe',authenticate, upload.single('image'), recipeController.postRecipePage);
router.get('/details', recipeController.getRecipePage);
router.get('/recipeDetails/:recipeId', authenticate, recipeController.getRecipeDetails)
router.get('/checkfavorite/:recipeId', authenticate, recipeController.checkFavStatus);

//edit recipe
router.put('/editWithImage/:recipeId', authenticate, upload.single('image'), recipeController.updateRecipewithImage);
router.put('/editNoImage/:recipeId', authenticate, recipeController.updateRecipewoImage);       

//search routes
router.get('/search', recipeController.getSearchPage);
router.post('/details', authenticate, recipeController.searchRecipes);

module.exports = router;