const Favorite = require('../models/favorite');
const sequelize = require('../util/database');

exports.addRecord = async(req, res) => {
    const recipeId = req.params.recipeId;
    try{
        await Favorite.create({
            recipeId: recipeId,
            UserId:req.user.id
        });

        res.status(200).json({message: 'Added to Favorites'});
    } catch(err) {
        res.status(500).json({message: 'Failed to Favorite this recipe!'});
    }
};

exports.unFavRecipe = async(req, res) => {
    const recipeId = req.params.recipeId;
    const t = await sequelize.transaction();
    try {
        const favNode = await Favorite.findOne({
            where: {
                UserId: req.user.id,
                recipeId: recipeId
            }
        }, {transaction: t});

        await favNode.destroy({transaction: t});

        await t.commit();

        res.status(200).json({message: 'Successfully UnFavorited!'});
    } catch(err) {
        res.status(500).json({message: 'Failed to unFavorite this recipe!'});
    }
}