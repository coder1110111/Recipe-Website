const express = require('express');
const router = express.Router();

//Controller Import
const profileController = require('../controller/profileControl');
const authenticate = require('../middleware/authentication');

router.get('/', profileController.getUsersPage);
router.get('/allUsersDetails', profileController.getAllUsers);
router.get('/profile', profileController.getProfilePage);
router.get('/profile/:id', authenticate, profileController.getProfileInfo);
router.get('/follow-status/:visitedUserId', authenticate, profileController.getFollowStatus);
router.post('/follow/:visitedUserId', authenticate, profileController.followVisitingUser);
router.post('/unfollow/:visitedUserId', authenticate, profileController.unfollowVisitingUser);
router.get('/getRecipes/:visitedUserId', profileController.getRecipes);


module.exports = router;