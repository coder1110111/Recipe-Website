const sequelize = require('../util/database');

const CollectionRecipe = sequelize.define('CollectionRecipe', {}, {timestamps: false});

module.exports = CollectionRecipe;