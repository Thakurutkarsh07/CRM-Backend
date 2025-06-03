// routes/dashboardRoutes.js
const express = require('express');
const router = express.Router();
const dashboardController = require('../controllers/dashboardController');

// Route to get stats (active customers, campaigns, success rate)
router.get('/stats', dashboardController.getStats);

// Route to get recent 5 campaigns
router.get('/recent-campaigns', dashboardController.getRecentCampaigns);

module.exports = router;
