const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const CommunicationLog = require('../models/CommunicationLog');

router.get('/delivery-over-time', async (req, res) => {
  const { campaignId } = req.query;

  if (!mongoose.Types.ObjectId.isValid(campaignId)) {
    return res.status(400).json({ error: 'Invalid campaign ID' });
  }

  try {
    const stats = await CommunicationLog.aggregate([
      {
        $match: {
          campaignId: new mongoose.Types.ObjectId(campaignId),
          status: 'SENT',
        },
      },
      {
        $group: {
          _id: { $dateToString: { format: "%Y-%m-%d", date: "$timestamp" } },
          sentMessages: { $sum: 1 },
        },
      },
      { $sort: { _id: 1 } },
      {
        $project: {
          date: '$_id',
          sentMessages: 1,
          _id: 0,
        },
      },
    ]);

    res.json({ deliveryStats: stats });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
