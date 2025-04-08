const express = require('express');
const router = express.Router();

const recipeController = require('../controller/recipeControl');
const authenticate = require('../middleware/authentication');
const upload = require('../middleware/upload');

router.get('/share-a-recipe', recipeController.getRecipePostPage);
router.post('/share-a-recipe',authenticate, upload.single('image'), recipeController.postRecipePage);
router.get('/details', recipeController.getRecipePage);
router.get('/recipeDetails/:recipeId', recipeController.getRecipeDetails)

module.exports = router;