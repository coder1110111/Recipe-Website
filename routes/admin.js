const express = require('express');
const router = express.Router();

const authenticate = require('../middleware/authentication');

const adminController = require('../controller/adminControl');

router.get('/dashboard', adminController.getAdminPage);

router.get('/check', authenticate, adminController.checkAdmin);
router.get('/users', authenticate, adminController.getAllUsers);
router.delete('delete-user/:id', adminController.deleteUserAndData);
router.put('/toggle-ban/:id', authenticate, adminController.toggleBanStatus);

module.exports = router;