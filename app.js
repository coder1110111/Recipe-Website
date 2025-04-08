const express = require('express');
const cors = require('cors');
const path = require('path');
const multer = require('multer');

require("dotenv").config();

const sequelize = require('./util/database');

//Routes import 
const loginSignUpRoutes = require('./routes/signUp-login');
const passRoutes = require('./routes/password');

const adminRoutes = require('./routes/admin');
const homeRoutes = require('./routes/home');
const recipeRoutes = require('./routes/recipe');
const reviewRoutes = require('./routes/review');
const favoriteRoutes = require('./routes/favorite');
const collectionRoutes = require('./routes/collections');
const activityRoutes = require('./routes/activity');
const userRoutes = require('./routes/user');


//Model Import
const { User, LinkTable, Recipe, Favorite, Collection, CollectionRecipe, Rating, Review, Follower, setupAssociations } = require('./models/associations');

setupAssociations();
//
const app = express();

//Basic Security measures
app.use((req, res, next) => {
    res.setHeader('X-Content-Type-Options', 'nosniff');
    res.setHeader('X-Frame-Options', 'DENY');  
    next();
})

//Basic access
app.use(express.json());
app.use(cors());

//sends these files first
app.use(express.static(path.join(__dirname, 'public')));

//Routes Call
app.use('/userCheck', loginSignUpRoutes);
app.use('/password', passRoutes);

app.use('/home', homeRoutes);
app.use('/recipe', recipeRoutes);
app.use('/user',userRoutes);
app.use('/review', reviewRoutes);
app.use('/favorites', favoriteRoutes);



//404 call
app.use((req,res,next) => {
    res.status(404).sendFile(path.join(__dirname,'views', '404.html'))
});

//Server Init
const PORT = process.env.PORT;

//sequelize call and server start

//sequelize.sync({alter:true})
sequelize.sync()
.then(result => {
    app.listen(PORT, () => {
        console.log(`Server is running at PORT : ${PORT}`)
    });
}).catch(err => console.log('DATABASE Connection error : ', err));