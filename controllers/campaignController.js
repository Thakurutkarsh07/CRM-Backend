// controllers/campaignController.js

const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');



const getCampaignHistory = async (req, res) => {
    try {
      const campaigns = await Campaign.find({})
        .sort({ createdAt: -1 });
  
      const logs = await CommunicationLog.find({});
  
      const history = campaigns.map(camp => {
        const relatedLogs = logs.filter(log => log.campaignId.toString() === camp._id.toString());
        const sent = relatedLogs.filter(l => l.status === 'SENT').length;
        const failed = relatedLogs.filter(l => l.status === 'FAILED').length;
  
        return {
          _id: camp._id,
          name: camp.name,
          audience_count: camp.audience_count,
          sent,
          failed,
          createdAt: camp.createdAt,
          status: camp.status
        };
      });
  
      res.status(200).json({ campaigns: history });
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

  
  module.exports = {
    getCampaignHistory // add this
  };
  