const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Route to handle Google login
router.post('/google-login', authController.googleLogin);

module.exports = router;
