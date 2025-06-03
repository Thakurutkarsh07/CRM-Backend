const express = require('express');
const router = express.Router();
const { previewSegment } = require('../controllers/segmentController');

router.post('/preview', previewSegment);

module.exports = router;
