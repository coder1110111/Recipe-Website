const express = require('express');
const router = express.Router();

const activityController = require('../controller/activityControl');
const authenticate = require('../middleware/authentication');

router.get('/', activityController.getActivityPage);
router.get('/feed', authenticate, activityController.getActivityFeed);

module.exports = router;