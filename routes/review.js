const express = require('express');
const router = express.Router();

const reviewController = require('../controller/reviewControl');
const authenticate = require('../middleware/authentication');

router.get('/:id', reviewController.getReviews);
router.post('/:id', authenticate, reviewController.postReview);

module.exports = router;