const express = require('express');
const router = express.Router();

const profileController = require('../controller/profileControl');
const authenticate = require('../middleware/authentication');


//router.get('/selfProfile',authenticate, profileController.getMyProfile);
router.get('/profile', profileController.getProfilePage);
router.get('/profile/:id', authenticate, profileController.getProfileInfo);

module.exports = router;