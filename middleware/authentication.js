const jwt = require('jsonwebtoken');
require("dotenv").config();

const User = require('../models/user');

const authenticate = async(req, res, next) => {
    const token = req.header('Authorization');
    console.log(token + " >>> is token");
    try {
        const id = jwt.verify(token, process.env.JWT_SECRET).id;

        const user = await User.findOne({where: {id}});
        if(!user) {
            console.log('No User!');
        }

        if(user.is_banned) {
            return res.status(403).json({message: 'You are banned. Communicate with an Admin'});
        }
        req.user = user;
        console.log('Authenticated!');
        next();
    } catch(error) {
        return res.status(403).json({message: "Forbidden: Invalid or Expired Token"});
    }
}


module.exports = authenticate;