const express = require('express');
const router = express.Router();
const { getSegmentedAudience } = require('../controllers/audienceController');

router.post('/segment', getSegmentedAudience);

module.exports = router;
