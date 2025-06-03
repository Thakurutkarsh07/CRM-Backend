// routes/campaignRoutes.js

const express = require('express');
const router = express.Router();
const {  getCampaignHistory } = require('../controllers/campaignController');
const {createCampaign,previewAudienceSize, previewEmails,sendSelectedEmail, createNewCampaign,getCampaignSummary } = require('../controllers/createCampaign')
// router.post('/create', createCampaign);
router.get('/history', getCampaignHistory); // new
router.post('/campaign',createCampaign);
router.post('/preview', previewAudienceSize);
router.post('/previewEmails',previewEmails)
router.post('/sendSelectedEmail',sendSelectedEmail)
router.post('/createnewcampaign',createNewCampaign)

router.get("/:id/summary", getCampaignSummary);

module.exports = router;
