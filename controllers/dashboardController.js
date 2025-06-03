const Campaign = require('../models/Campaign');
const Customer = require('../models/Customer');

exports.getStats = async (req, res) => {
  try {
    const activeCustomers = await Customer.countDocuments();
    const campaigns = await Campaign.countDocuments();
    
    // Calculate delivery success rate
    const campaignsWithSuccess = await Campaign.find({ status: 'SENT' });
    const successRate = (campaignsWithSuccess.length / campaigns) * 100;

    res.json({
      activeCustomers,
      campaigns,
      deliverySuccessRate: Math.round(successRate)
    });
  } catch (error) {
    console.error('Error fetching stats:', error);
    res.status(500).json({ error: 'Failed to fetch stats' });
  }
};

exports.getRecentCampaigns = async (req, res) => {
  try {
    const recentCampaigns = await Campaign.find()
      .sort({ createdAt: -1 })
      .limit(5);  // Get the 5 most recent campaigns

    res.json(recentCampaigns);
  } catch (error) {
    console.error('Error fetching recent campaigns:', error);
    res.status(500).json({ error: 'Failed to fetch campaigns' });
  }
};
