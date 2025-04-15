const express = require('express');
const router = express.Router();

const InsideCollectionController = require('../controller/InsideCollectionControl');
const authenticate = require('../middleware/authentication');

router.get('/recipes/:collectionId', authenticate, InsideCollectionController.getCollectionRecipes);
router.delete('/remove-recipe/:collectionId', authenticate, InsideCollectionController.removeRecipeFromCollection);

module.exports = router;