const path = require('path');
const Follower = require('../models/follower');
const Recipe = require('../models/recipe');
const User = require('../models/user');

exports.getActivityPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'activity.html'));
}

exports.getActivityFeed = async (req, res) => {
    try {

        const following = await Follower.findAll({
            where: {
                follower_id: req.user.id
            },
            attributes: ['following_id']
        });

        const followingIds = following.map(f => f.following_id);
        const recipes = await Recipe.findAll({
            where: {
                UserId: followingIds
            },
            include: {
                model: User,
                attributes: ['name']
            },
            order: [['createdAt', 'DESC']]
        });
        res.status(200).json({recipes});
    }
    catch(err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to fetch activity feed.' });
    }
};