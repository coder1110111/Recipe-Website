const express = require('express');
const router = express.Router();

const personalController = require('../controller/personalControl');
const authenticate = require('../middleware/authentication');

router.get('/getMyProfilePage', personalController.getMyProfilePage)
router.get('/my-profile', authenticate, personalController.getMyData);
router.put('/update-bio', authenticate, personalController.updateBio);
router.get('/recipe/favorites', personalController.getFavoritesPage);
router.get('/favorites', authenticate, personalController.getUserFavorites)
router.get('/collections', personalController.getCollectionsPage);
router.delete('/delete-recipe/:recipeId', authenticate, personalController.deleteRecipe);
router.get('/edit-recipe', personalController.getEditPage);


module.exports = router;