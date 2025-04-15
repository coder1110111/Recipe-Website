const User = require('../models/user');
const Follower = require('../models/follower');
const Recipe = require('../models/recipe');
const Favorite = require('../models/favorite');

const path = require('path');
const { Sequelize } = require('sequelize');
const sequelize = require('../util/database');

exports.getMyProfilePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'main-page', 'myProfile.html'));
}

exports.getMyData = async(req, res) => {
    try{
        const userData = await User.findOne({
            where: { id: req.user.id},
            attributes: ['name', 'bio', 'is_admin']
        });
        console.log(userData);
        const userFollowing = await User.findByPk(req.user.id, {
            include: [{
                model: User,
                as: 'Following',
                attributes: ['id', 'name'],
                through: { attributes: []}
            }],
            attributes: []
        });

        const RecipeData = await Recipe.findAll({
            where: {
                UserId: req.user.id
            }
        });
        console.log(RecipeData);

        res.status(200).json({
            userData,
            RecipeData,
            followingData: userFollowing.Following
        });

    } catch(err) {
        res.status(500).json({error: 'Error fetching your Account Data'});
    }
}

exports.updateBio = async(req, res) => {
    const newBio = req.body.bio;
    const t = await sequelize.transaction();
    try{
        const updatedUser= await req.user.update({bio: newBio}, {transaction: t});
        await t.commit();

        res.status(200).json({message: 'Bio Update!'});
    } catch(err) {

        await t.rollback();
        console.log(err);
        res.status(500).json({error: 'Internal Server Error'});
    }
}

exports.getFavoritesPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'favorite.html'));
}

exports.getUserFavorites = async(req, res) => {
    try {
        const favoritesData = await User.findByPk(req.user.id, {
            include: [{
                model: Recipe,
                as: 'FavoritedRecipes',
                attributes: ['id', 'title', 'image_url'],
                through: { attributes: []}
            }],
            attributes: []
        });

        return res.status(200).json({favoritesData});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Failed to fetch Favorites Data'});
    }
}

exports.getCollectionsPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'CollectionsPage.html'));
}

exports.deleteRecipe = async(req, res) => {
    const recipeId = req.params.recipeId;
    try {
        const RecipeData = await Recipe.findByPk(recipeId);

        await RecipeData.destroy();
        res.status(200).json({message: 'Recipe successfully deleted!'});
    } catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Failed to delete the Recipe'});
    }
}

exports.getEditPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'EditRecipe.html'));
}