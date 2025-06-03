// routes/customerRoutes.js
const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');
const authenticateJWT = require('../middleware/authMiddleware');

// POST to create customer
router.post('/', authenticateJWT, customerController.createCustomer);

// GET all customers
router.get('/', authenticateJWT, customerController.getAllCustomers);

module.exports = router;
