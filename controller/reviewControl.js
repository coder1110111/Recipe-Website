const Review = require('../models/review');
const User = require('../models/user');
const Recipe = require('../models/recipe');

exports.getReviews = async (req, res) => {
    const recipeId = req.params.id;

        const reviews = await Review.findAll({
            where: { recipeId: recipeId},
            limit: 5,
            order: [['createdAt', 'DESC']],
            include: {
                model: User,
                attributes: ['name']
            }
        });
        res.json(reviews);    
}

exports.postReview = async (req, res) => {
    const recipeId = req.params.id;

    const review = await Review.create({
        comment: req.body.comment,
        UserId: req.user.id,
        recipeId: recipeId
    });

    res.status(201).json(review);
}