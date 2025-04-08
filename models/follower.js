const sequelize = require('../util/database');

const Follower = sequelize.define('Follower', {}, {timestamps: false});

module.exports = Follower;