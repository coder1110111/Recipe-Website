const express = require('express');
const router= express.Router();

const passController = require('../controller/password');

router.get('/Reset-Password/:linkTableId', passController.getResetPassword);
router.post('/Reset-Password/:linkTableId', passController.postResetPassword);


module.exports = router;