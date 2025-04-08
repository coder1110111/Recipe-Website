const Recipe = require('../models/recipe');
const User = require('../models/user');
const path = require('path');

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