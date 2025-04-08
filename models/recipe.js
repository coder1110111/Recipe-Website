const Sequelize = require('sequelize');
const sequelize = require('../util/database');

const Recipe = sequelize.define('recipe', {
    id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true
    },
    title: {
        type: Sequelize.STRING,
        allowNull: false
    },
    description: {
        type: Sequelize.TEXT,
    },
    cuisine_type: {
        type: Sequelize.ENUM('Vegetarian', 'Vegan', 'Non-Vegetarian', 'Keto', 'Mediterranean', 'Chinese', 'Indian', 'American', 'French', 'none')
    },
    ingredients: {
        type: Sequelize.TEXT
    },
    instructions: {
        type: Sequelize.TEXT
    },
    prep_time: {
        type: Sequelize.INTEGER
    },
    servings: {
        type: Sequelize.INTEGER
    },
    image_url: {
        type: Sequelize.STRING
    }
});

module.exports = Recipe;