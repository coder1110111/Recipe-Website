const User = require('../models/user')
const Follower = require('../models/follower');
const Recipe = require('../models/recipe');
const path = require('path');
const { Sequelize } = require('sequelize');

exports.getUsersPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'AllUsers.html'));
}

exports.getAllUsers = async(req, res) => {
    console.log('Getting All Users');
    try {
        const authorsInfo = await User.findAll({
            attributes: ['id', 'name', [Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM recipes AS recipe
                    WHERE recipe.UserId = User.id
                )`), 'recipeCount'], [Sequelize.literal(`(
                    SELECT COUNT(*)
                    FROM followers as follower
                    WHERE follower.following_id = User.id    
                )`), 'followerCount']
            ]
        });

        res.status(200).json(authorsInfo);
    } catch(err) {
        res.status(500).json({ error: 'Error fetching Authors' });
    }
};

exports.getProfilePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'profile.html'));
}

exports.getProfileInfo = async (req, res) => {
    const visiterId = req.params.id;

    const accountData = await User.findOne({
        where: {id: visiterId}
    });
    res.status(200).json({accountData});
}

exports.getFollowStatus = async(req, res) => {
    try {
        const loggedInUserId = req.user.id;
        const visitedUserId = req.params.visitedUserId;

        const follow = await Follower.findOne({
            where: {
                follower_id: loggedInUserId,
                following_id: visitedUserId
            }
        });
        res.json({ isFollowing: !!follow});

    } catch(err) {
        res.status(500).json({ error: 'Failed to check follow Status'});
    }
};

exports.followVisitingUser = async(req, res) => {
    try {
        const currUserId = req.user.id;
        const visitingUserId = req.params.visitedUserId;

        await Follower.create({
            following_id: visitingUserId,
            follower_id: currUserId
        });
        res.status(200).json({message: 'User followed successfully!'});
    } catch(err) {
        res.status(500).json({ error: 'Failed to follow this user'});
    }
}

exports.unfollowVisitingUser = async(req, res) => {
    try{
        const currUserId = req.user.id;
        const visitingUserId = req.params.visitedUserId;

        const followLink = await Follower.findOne({
            where: {
                follower_id: currUserId,
                following_id: visitingUserId
            }
        });

        await followLink.destroy();

        res.status(200).json({message: 'Unfollowed Successfully!'});
    } catch(err) {
        res.status(500).json({ error: 'Failed to unfollow this user'});
    }
}

exports.getRecipes = async(req, res) => {
    try{
        const visitingUserId = req.params.visitedUserId;

        const recipes = await Recipe.findAll({
            where: {
                UserId: visitingUserId
            },
            order: [['createdAt', 'DESC']],
        });
        res.status(200).json({recipes});
    } catch(err) {
        res.status(500).json({ error: 'Failed to fetch User Recipes'});
    }
};