const path = require('path');
const Review = require('../models/review');
const User = require('../models/user');
const Recipe = require('../models/recipe');
const Follower = require('../models/follower');
const sequelize = require('../util/database');

exports.getAdminPage = (req, res) => {
        return res.sendFile(path.join(__dirname, '..', 'views', 'adminPage.html'));
}

exports.checkAdmin = async(req, res) => {
    console.log(req.user)
    res.json({isAdmin: req.user.is_admin});
}

exports.getAllUsers = async(req, res) => {
    try {
        const users = await User.findAll({
            attributes: ['id', 'name', 'email', 'is_banned']
        });
        res.json(users);
    }
    catch(err) {
        res.status(500).json({ message: 'Error fetching users'});
    }
};

exports.deleteUserAndData = async(req, res) => {
    try {
        const t = await sequelize.transaction();
        const userId = req.params.id;

        await Review.destroy({where: {UserId: userId}}, {transaction: t});
        await Recipe.destroy({where: {UserId: userId}}, {transaction: t});
        await Follower.destroy({ where: {following_id: userId}}, {transaction: t});
        await Follower.destroy({where: {follower_id: userId}}, {transaction: t});
        await User.destroy({where: {id: userId}}, {transaction: t});
        await t.commit();

        res.status(200).json({message: 'User and related data deleted successfully!'});
    }
    catch(err) {
        res.status(500).json({message: 'Error deleting user'});
    }
}

exports.toggleBanStatus = async(req, res) => {
    try {
        const userId = req.params.id;
        const user = await User.findByPk(userId);

        if (!user) return res.status(404).json({ message: 'User not found' });

        user.is_banned = !user.is_banned;
        await user.save();

        res.status(200).json({ is_banned: user.is_banned });
    } catch (err) {
        res.status(500).json({ message: 'Error toggling ban status' });
    }
}