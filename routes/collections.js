const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authentication');

const CollectionController = require('../controller/collectionControl');

router.get('/get-collection', authenticate, CollectionController.getAllCollections);
router.post('/create-collection', authenticate, CollectionController.createCollection);
router.get('/get-collection-details', CollectionController.getCollectionPage);
router.post('/check-recipe/:recipeId', authenticate, CollectionController.checkRecipeInCollection);
router.post('/add-Recipe/:recipeId', authenticate, CollectionController.addRecipeToCollection);
router.delete('/delete-collection/:collectionId', authenticate, CollectionController.deleteCollection);

module.exports = router;