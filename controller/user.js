const User = require('../models/user');
const LinkTable = require('../models/linktable');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const Sib = require('sib-api-v3-sdk');
const path = require('path');

require("dotenv").config();

exports.getCreateUser = (req,res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'signup.html'));
};

exports.postCreateUser = async (req, res) => {
    console.log('Request Received!');

    const name = req.body.username;
    const email = req.body.email;
    const password = req.body.password;
    const admin = req.body.is_admin;

    if(!name || !email || !password) {
        console.log('Validation Error!');
        return res.status(400).json({error: 'All fields are required!'});
    }

    try {
        const existingUser = await User.findOne({where : {email}});
        if(existingUser){
            return res.status(409).json({message: 'Email already in use!'});
        }

        bcrypt.hash(password, 10, async(error, hash) => {
            console.log(error);
            await User.create({
                name: name,
                email: email,
                password: hash,
                is_admin: admin
            });
            res.status(201).json({message: 'User Created!'});
        })
    }
    catch(err) {
        console.log(err);
        return res.status(500).json({error: 'Internal Server Error'});
    }
}

exports.getLogin = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'login.html'));
}

exports.postLogin = async (req, res) => {
    console.log('Request Received');
    const {email, password} = req.body;
    if(!email || !password) {
        return res.status(400).json({message: 'All fields are Required!'});
    }
    try {
        const user = await User.findOne({where: {email: email}});
        if(!user) {
            return res.status(404).json({message: 'Email does not Exist!'});
        }
        if(user.is_banned == true) {
            return res.status(403).json({message: 'Contact an Admin!'});
        }
        const match = await bcrypt.compare(password, user.password);
        if(!match){
            return res.status(401).json({message: "Incorrect Password!"});
        }
        const token = jwt.sign({id: user.id}, process.env.JWT_SECRET);

        res.status(200).json({message: 'Login Successful!', token});
    }
    catch(error) {
        console.log('Login Error: ', error);
        res.status(500).json({message: 'Internal Server Error!'});
    }
};

exports.getForgetPassword = (req, res) => {
    res.sendFile(path.join(__dirname, '..', 'views', 'forgetPassword.html'));
}

exports.postForgetPassword = async (req, res) => {
    console.log("Reset Password Request received!");
    console.log(req.body);
    const {email} = req.body;

    const client = Sib.ApiClient.instance;

    const apiKey = client.authentications['api-key'];
    apiKey.apiKey = process.env.BREVO_KEY;

    const tranEmailApi = new Sib.TransactionalEmailsApi();

    const sender = {
        email: 'ayush.yadav.dev610@gmail.com'
    };
    
    const receivers = [
        {
            email: email
        }
    ];

    try {
        const checkUser = await User.findOne({where: {email: email}});
        if(!checkUser) {
            return res.status(404).json({error: 'Email does not exist in the Website'});
        }

        const activeLink = await LinkTable.findOne({where: {userId: checkUser.id}});
        if(activeLink) {
            await activeLink.destroy();
        }

        const createLink = await LinkTable.create({
            userId: checkUser.id,
            isActive: 'true'
        });
        console.log(createLink);

        const response = await tranEmailApi.sendTransacEmail({
            sender,
            to: receivers,
            subject: 'Test Email using Sib',
            textContent:`Please click on this link to change your password http://localhost:3030/password/Reset-Password/${createLink.id}!`
        });

        console.log(response);

    } catch(error) {
        console.log('There is an error >>>>', error);
    }
}