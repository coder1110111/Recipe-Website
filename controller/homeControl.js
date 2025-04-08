const path = require('path');

const Recipe = require('../models/recipe');
const User = require('../models/user');

exports.getMainPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'main.html'));
}

exports.getAllRecipes = async(req, res) => {
    try {
        const recipes = await Recipe.findAll({
            order: [['createdAt', 'DESC']],
        });    
        
        res.status(200).json(recipes);
    } catch(error) {
        console.error('Error fetching recipes: ', error);
        res.status(500).json({error: 'Failed to fetch recipes'});
    }
};