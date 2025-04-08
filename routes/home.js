const express = require('express');
const router = express.Router();

//middleware
const authenticate = require('../middleware/authentication');

//controller
const homeController = require('../controller/homeControl');

router.get('/page', homeController.getMainPage);
router.get('/getRecipe', homeController.getAllRecipes);

module.exports = router;