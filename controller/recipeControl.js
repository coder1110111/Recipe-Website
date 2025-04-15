const Recipe = require('../models/recipe');
const User = require('../models/user');
const Favorite = require('../models/favorite');
const path = require('path');
const { Op } = require('sequelize');

exports.getRecipePostPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'recipes.html'));
}

exports.postRecipePage = async (req, res) => {
    //console.log(req.body);
    //console.log(req.file.location);

    try {
        const {title, description, cuisine, ingredients, instructions, prepTime, servings} = req.body;
        
        const recipe = await Recipe.create({
            title: title,
            description: description,
            cuisine_type: cuisine,
            ingredients: ingredients,
            instructions: instructions,
            prep_time: prepTime,
            servings: servings,
            image_url: req.file.location,   //this is S3 URL
            UserId: req.user.id            
        });

        res.status(201).json({message: 'Recipe uploaded successfully!', recipe});
    } catch(err) {
        console.error('Upload error: ', err);
        res.status(500).json({error: 'Something went wrong!'});
    }
};

exports.getRecipePage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'getRecipe.html'));
}

exports.getRecipeDetails = async(req, res) => {
    const id = req.params.recipeId;
    //console.log(id);
    try {
        const recipe = await Recipe.findOne({
            where: {id: id},
            include: {
                model: User,
                attributes: ['name']
            }
        });
        if(!recipe)
            return res.status(404).json({error: 'Recipe not Found'});
        res.status(200).json(recipe);
    } catch(err) {
        console.error('Error Fetching Recipe :', err);
        res.status(500).json({error: 'Failed to fetch recipe'});
    }
};


exports.checkFavStatus = async(req, res) => {
    const recipeId = req.params.recipeId;
    try{
        const inFav = await Favorite.findOne({
            where: {
                UserId: req.user.id,
                recipeId: recipeId
            }
        });
        if(inFav) {
            console.log('In Fav');
            res.status(200).json({isFav: true})
        } else {
            console.log('Not a favorite');
            res.status(200).json({isFav: false});
        }
    } catch(err) {
        res.status(500).json({error: 'Falied to fetch Favorite Status'});
    }
}

exports.updateRecipewithImage = async (req, res) => {
    try {
        const { title, description, cuisine, ingredients, instructions, prepTime, servings } = req.body;
        const recipeId = req.params.recipeId; // assuming you're passing it as a URL param

        const updated = await Recipe.update({
            title: title,
            description: description,
            cuisine_type: cuisine,
            ingredients: ingredients,
            instructions: instructions,
            prep_time: prepTime,
            servings: servings,
            image_url: req.file.location, // S3 URL
        }, {
            where: { id: recipeId, UserId: req.user.id }
        });

        if (updated === 0) {
            return res.status(404).json({ message: 'Recipe not found or not updated' });
        }

        res.status(200).json({ message: 'Recipe updated successfully!' });
    } catch (err) {
        console.error('Upload error: ', err);
        res.status(500).json({ error: 'Something went wrong!' });
    }
};

exports.updateRecipewoImage = async (req, res) => {
    try {
        const { title, description, cuisine, ingredients, instructions, prepTime, servings } = req.body;
        const recipeId = req.params.recipeId;

        const updated = await Recipe.update({
            title: title,
            description: description,
            cuisine_type: cuisine,
            ingredients: ingredients,
            instructions: instructions,
            prep_time: prepTime,
            servings: servings, 
        }, {
            where: {id: recipeId, UserId: req.user.id}
        });

        if(updated === 0) {
            return res.status(404).json({message: 'Recipe does not exist or it is not your recipe'});
        }
        res.status(200).json({ message: 'Recipe updated successfully!' });
    } catch(err) {
        console.error('Upload error: '. err);
        res.status(500).json({ error: 'Something went wrong!' });
    }
}

exports.getSearchPage = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'searchPage.html'));
}


exports.searchRecipes = async(req, res) => {
    try {
        const {query = '', diet, prepTime } = req.body;
        console.log('query : ', query);
        console.log('diet : ', diet);
        console.log('prepTime : ', prepTime);

        const filters = {
            [Op.or]: [
                { title: { [Op.like]: `%${query}%` }},
                { description: { [Op.like]: `%${query}%` }},
                { ingredients: { [Op.like]: `%${query}%` }},
                { cuisine_type: { [Op.like]: `%${query}%` }}
            ]
        };

        if(diet) filters.cuisine_type = diet;
        if(prepTime) filters.prep_time = { [Op.lte]: prepTime };

        const recipes = await Recipe.findAll( {
            where: filters,
            include: [{
                model: User,
                attributes: ['name']
            }],
            order: [['createdAt', 'DESC']]
        });

        res.status(200).json({recipes});

    } catch(err) {
        console.error(err);
        res.status(500).json({message: 'Error searching recipes'});
    }
}