const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Review = sequelize.define('Review', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    comment: {
        type: Sequelize.TEXT
    }
});

module.exports = Review;