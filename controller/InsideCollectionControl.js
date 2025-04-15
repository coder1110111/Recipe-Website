const CollectionRecipe = require('../models/collectionRecipe');
const Recipe = require('../models/recipe');
const Collection = require('../models/collection');
const sequelize = require('../util/database');

exports.getCollectionRecipes = async(req, res) => {
    try {
        const collectionId = req.params.collectionId;

        const collectionData = await Collection.findByPk(collectionId, {
            include: [{
                model: Recipe,
                attributes: ['id', 'title', 'image_url'],
                through: { attributes: ['CollectionId', 'recipeId']}
            }]
        });

        res.status(200).json({message: 'Fetched all Data', collectionData});
    } 
    catch(err) {
        res.status(500).json({message: 'Failed to fetch this Collections Recipes Data.'});
    }
}

exports.removeRecipeFromCollection = async(req, res) => {
    try {
        const collectionId = req.params.collectionId;
        const recipeId = req.body.recipeId;

        const recipeInCollection = await CollectionRecipe.findOne({
            where: {
                CollectionId: collectionId,
                recipeId: recipeId
            }
        });
        console.log(recipeInCollection);

        await recipeInCollection.destroy();

        res.status(200).json({message: 'This recipe is removed from the Collection'});

    } catch(err) {
        res.status(500).json({message: 'Failed to remove recipe from the Collection.'});
    }
}