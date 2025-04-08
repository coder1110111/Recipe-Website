const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Favorite = sequelize.define('favorite', {}, {timestamps: true});

module.exports = Favorite;