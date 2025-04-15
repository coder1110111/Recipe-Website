const Collection = require('../models/collection');
const CollectionRecipe = require('../models/collectionRecipe');
const path = require('path');
const sequelize = require('../util/database');

exports.getAllCollections = async (req, res) => {
    try {
        const CollectionData = await Collection.findAll({
            where: {
                UserId: req.user.id
            }
        });

        res.status(200).json({message: 'Data fetched!', CollectionData});
    } catch(err) {
        res.status(500).json({message: 'Failed to fetch Collections Data'});
    }
}

exports.createCollection = async(req, res) => {
    const name = req.body.name;
    try {
        const newCollection = await Collection.create({
            name: name,
            UserId: req.user.id
        });
        if(!newCollection) {
            res.status(500).json({message: 'Error creating Collection!'});    
        }
        else {
            res.status(201).json({message: 'Created Successfully', newCollection});
        }
    }
    catch(err) {
        res.status(500).json({message: 'Error creating Collection!'});
    }
};

exports.getCollectionPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'SingleCollection.html'));
}

exports.checkRecipeInCollection = async(req, res) => {
    const recipeId = req.params.recipeId;
    const collectionId = req.body.collectionId;
    try{
        const checkRes = await CollectionRecipe.findOne({
            where: {
                CollectionId: collectionId,
                recipeId: recipeId
            }
        });
        if(checkRes) {
            res.status(200).json({exists: true});
        } else {
            res.status(200).json({exists: false});
        }
    } catch (err) {
        res.status(500).json({message: 'Error checking Recipe Status in Collection!'});
    }
};

exports.addRecipeToCollection = async (req, res) => {
    try{
        const recipeId = req.params.recipeId;
        const collectionId = req.body.collectionId;

        const dataRecipe = await CollectionRecipe.create({
            CollectionId: collectionId,
            recipeId: recipeId
        });

        res.status(200).json({message: 'Recipe added to Collection', dataRecipe});
    } catch(err) {
        res.status(500).json({message: 'Error adding Recipe to Collection!'});
    }
}

exports.deleteCollection = async(req, res) => {
    const t = await sequelize.transaction();
    const collectionId = req.params.collectionId;

    try {
        const collectionData = await Collection.findByPk(collectionId, {transaction: t});

        await CollectionRecipe.destroy({
            where: {
                CollectionId: collectionId
            }
        }, {transaction: t});
        console.log('Found the Collection');
        await collectionData.destroy({transaction: t});

        await t.commit();

        res.status(200).json({message: 'Collection Deleted!'});
    } 
    catch(err) {
        console.log(err);
        res.status(500).json({message: 'Error deleting Collection!'});
    }
}