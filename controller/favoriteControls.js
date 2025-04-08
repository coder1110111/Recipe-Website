const Favorite = require('../models/favorite');

exports.addRecord = async(req, res) => {
    const recipeId = req.body.recipeId;
    await Favorite.create({
        recipeId: recipeId,
        UserId:req.user.id
    })
};