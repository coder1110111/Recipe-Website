const sequelize = require('../util/database');
const Sequelize = require('sequelize');

const Rating = sequelize.define('Rating', {
    rating: {
        type: Sequelize.INTEGER,
        allowNull: false
    }
})

module.exports = Rating;