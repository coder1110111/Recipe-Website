const sequelize = require('../util/database');

const User = require('./user');
const LinkTable = require('./linktable');
const Recipe = require('./recipe');
const Collection = require('./collection');
const Favorite = require('./favorite');
const CollectionRecipe = require('./collectionRecipe');
const Rating = require('./rating');
const Review = require('./review');
const Follower = require('./follower');


const setupAssociations = () => {
    User.hasMany(Recipe);
    Recipe.belongsTo(User);

    User.belongsToMany(Recipe, { through: Favorite, as: 'FavoritedRecipes'});
    Recipe.belongsToMany(User, {through: Favorite});

    User.hasMany(Collection);
    Collection.belongsTo(User);

    Collection.belongsToMany(Recipe, { through: CollectionRecipe});
    Recipe.belongsToMany(Collection, { through: CollectionRecipe});

    User.belongsToMany(Recipe, { through: Rating, as: 'RatedTecipes'});
    Recipe.belongsToMany(User, { through: Rating});

    User.hasMany(Review);
    Review.belongsTo(User);

    Recipe.hasMany(Review);
    Review.belongsTo(Recipe);

    User.belongsToMany(User, { through: Follower, as: 'Followers', foreignKey: 'following_id'});
    User.belongsToMany(User, { through: Follower, as: 'Following', foreignKey: 'follower_id' });

    User.hasOne(LinkTable, {foreignKey: 'userId', onDelete: 'CASCADE'});
    LinkTable.belongsTo(User, {foreignKey: 'userId'});
};

module.exports = {User, LinkTable, Recipe, Favorite, Collection, CollectionRecipe, Rating, Review, Follower, setupAssociations};