const express = require('express');
const router = express.Router();

const userController = require('../controller/user');


router.get('/create-user', userController.getCreateUser);
router.post('/create-user', userController.postCreateUser);
router.get('/login', userController.getLogin);
router.post('/login', userController.postLogin);
router.get('/forgotPassword', userController.getForgetPassword);
router.post('/forgotPassword', userController.postForgetPassword);

module.exports = router;