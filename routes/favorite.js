const express = require('express');
const router = express.Router();

const favoriteController = require('../controller/favoriteControls');
const authenticate = require('../middleware/authentication');

router.post('/add', authenticate, favoriteController.addRecord);

module.exports = router;