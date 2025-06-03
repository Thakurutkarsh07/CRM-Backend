const Campaign = require('../models/Campaign');
const CommunicationLog = require('../models/CommunicationLog');
const Customer = require('../models/Customer');

const { sendEmail } = require('../utils/emailService');
const { generateEmail } = require('../utils/geminiService');
const { generateMultipleEmails } = require('../utils/geminiService');

exports.createNewCampaign = async(req,res)=>{
    const { name, message, rules, logic } = req.body;
   if (!name || !message || !rules || !logic) {
    return res.status(400).json({ msg: 'All fields are required' });
  }
    try{
      const customers = await Customer.find({});

    // Apply rules to filter the customers based on the logic provided
    const audience = customers.filter(c => applyRules(c, rules, logic));

    // Create a new campaign
    const campaign = await Campaign.create({
      name,
      message,
      rules,
      logic,
      audience_count: audience.length,
      status: 'PENDING', // Initially set campaign status to PENDING
    });
    campaign.save();
        res.status(201).json({ msg: 'Campaign sent', campaignId: campaign._id });
    }catch(err){
    res.status(500).json({ error: err.message });
    }
}

exports.createCampaign = async (req, res) => {
  const { name, message, rules, logic } = req.body;

  // Validate input fields
  if (!name || !message || !rules || !logic) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    // Fetch all customers from the database
    const customers = await Customer.find({});

    // Apply rules to filter the customers based on the logic provided
    const audience = customers.filter(c => applyRules(c, rules, logic));

    // Create a new campaign
    const campaign = await Campaign.create({
      name,
      message,
      rules,
      logic,
      audience_count: audience.length,
      status: 'PENDING', // Initially set campaign status to PENDING
    });

    // Send emails to filtered customers and log the delivery status
    const deliveryLogs = await Promise.all(
      audience.map(async (cust) => {
        // Generate personalized email content for each customer
        const { subject, body } = await generateEmail({
          name: cust.name,
          age: cust.age,
          location: cust.location,
          language: 'Hindi', // You can fetch this dynamically from the customer model if necessary
        });

        // Send the email
        const status = await sendEmail(cust.email, subject, body);

        // Return log data for this delivery
        return {
          campaignId: campaign._id,
          customerId: cust._id,
          status,
        };
      })
    );

    // Insert all email delivery logs into the CommunicationLog collection
    await CommunicationLog.insertMany(deliveryLogs);

    // Update the campaign status to SENT after all emails are delivered
    campaign.status = 'SENT';
    await campaign.save();

    // Respond with success
    res.status(201).json({ msg: 'Campaign sent', campaignId: campaign._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
};

// Apply the rules to filter customers
const applyRules = (customer, rules, logic) => {
  // Map over all rules and evaluate each one
  const conditions = rules.map(rule => {
    const value = customer[rule.field];
    switch (rule.operator) {
      case '>': return value > rule.value;
      case '<': return value < rule.value;
      case '>=': return value >= rule.value;
      case '<=': return value <= rule.value;
      case '==': return value == rule.value;
      case '!=': return value != rule.value;
      default: return false; // If an unknown operator is encountered
    }
  });

  // Apply the logic (AND or OR) based on the evaluation of the rules
  return logic === 'AND' ? conditions.every(Boolean) : conditions.some(Boolean);
};


exports.previewAudienceSize = async (req, res) => {
  const { rules, logic } = req.body;

  if (!rules || !logic) {
    return res.status(400).json({ msg: 'Rules and logic are required' });
  }

  try {
    const customers = await Customer.find({});
    const audience = customers.filter(c => applyRules(c, rules, logic));
    res.status(200).json({ count: audience.length });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Failed to preview audience size' });
  }
};


exports.previewEmails = async (req, res) => {
  const { name, age, location, language = "Hindi",title } = req.body;

  if (!name || !age || !location) {
    return res.status(400).json({ msg: "Missing required customer details" });
  }

  try {
    const emails = await generateMultipleEmails({ name, age, location, language,title });
    return res.status(200).json({ emails });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Failed to generate emails" });
  }
};


exports.sendSelectedEmail = async (req, res) => {
  const { campaignId, customerId, subject, body } = req.body;

  if (!campaignId || !customerId || !subject || !body) {
    return res.status(400).json({ msg: 'All fields are required' });
  }

  try {
    const customer = await Customer.findById(customerId);
    if (!customer) return res.status(404).json({ msg: 'Customer not found' });

    const status = await sendEmail(customer.email, subject, body);

    await CommunicationLog.create({
      campaignId,
      customerId,
      status,
    });

    return res.status(200).json({ msg: 'Email sent successfully', status });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: 'Failed to send email' });
  }
};


exports.getCampaignSummary = async (req, res) => {

  const minSpend = parseFloat(req.query.minSpend) || 10000;

  try {
    const campaignId = req.params.id;

    // Fetch campaign details
    const campaign = await Campaign.findById(campaignId);
    if (!campaign) return res.status(404).json({ error: "Campaign not found" });

    const totalUsers = campaign.audience_count;

    // Get delivered messages count
    const deliveredCount = await CommunicationLog.countDocuments({
      campaignId,
      status: "SENT",
    });

    // Get all customerIds targeted in this campaign
    const logs = await CommunicationLog.find({ campaignId }).select("customerId");
    const customerIds = logs.map(log => log.customerId);

    // Find high spenders in this list
// Find high spenders in this list
const highSpenders = await Customer.find({
  _id: { $in: customerIds },
  total_spent: { $gt: minSpend },
}).select("_id");


    const highSpenderIds = highSpenders.map(c => c._id);

    // Count how many high spenders received the message
    const highSpenderDelivered = await CommunicationLog.countDocuments({
      campaignId,
      status: "SENT",
      customerId: { $in: highSpenderIds },
    });

    // Prepare summary
    const deliveryRate = ((deliveredCount / totalUsers) * 100).toFixed(1);
const highSpenderRate = highSpenderIds.length > 0
  ? ((highSpenderDelivered / highSpenderIds.length) * 100).toFixed(1)
  : "0.0";


const summary = `Your campaign reached ${totalUsers} users. ${deliveredCount} messages were delivered, resulting in a ${deliveryRate}% delivery rate. Customers with > ₹${minSpend.toLocaleString()} spend had a ${highSpenderRate}% delivery success rate.`;

    return res.json({ summary });

  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Server error" });
  }
};