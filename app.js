// app.js
const express = require('express');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
const cors = require('cors');
const bodyParser = require("body-parser");
const { OAuth2Client } = require('google-auth-library');
const User = require('./models/User'); // User model file
const Customer = require('./models/Customer')
dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Routes
const customerRoutes = require('./routes/customerRoutes');
const demoSeed = require('./routes/demoSeed');
const segmentRoutes = require('./routes/segmentRoutes');
const audienceRoutes = require('./routes/audienceRoutes');
const campaignRoutes = require('./routes/campaignRoutes');
const emailRoutes = require("./routes/emailRoutes");
const authRoutes = require('./routes/authRoutes');
const dashboardRoutes = require('./routes/dashboardRoutes')
const authenticateJWT = require('./middleware/authMiddleware');
const campaignStatsRouter = require('./routes/campaignStats');




const CLIENT_ID = process.env.CLIENT_ID  // Use your actual Google Client ID
const client = new OAuth2Client(CLIENT_ID);
const getUserProfile = require('./controllers/profileController')
app.use('/api/auth', authRoutes); 
app.use('/api/campaignstats', campaignStatsRouter);
app.use('/api/customers', customerRoutes);
app.use('/api/seed',demoSeed)
app.use('/api/audience', audienceRoutes);
app.use('/api/segment', segmentRoutes);
app.use('/api/dashboard', dashboardRoutes);


app.get('/api/profile/getuser', authenticateJWT, getUserProfile.getUserProfile);
app.put('/api/profile/putuser', authenticateJWT, getUserProfile.updateUserProfile);

app.use('/api/campaign', campaignRoutes);

// POST /api/preview-audience
app.post('/api/preview-audience', async (req, res) => {
  try {
    const { rules } = req.body;

    // ✅ Validate
    if (!Array.isArray(rules)) {
      return res.status(400).json({ error: 'Rules must be an array' });
    }

    // ✅ Build MongoDB query object
    const query = {};

    rules.forEach(rule => {
      const { field, operator, value } = rule;

      if (!field || !operator) return;

      switch (operator) {
        case 'equals':
          query[field] = value;
          break;
        case 'not_equals':
          query[field] = { $ne: value };
          break;
        case 'greater_than':
          query[field] = { $gt: value };
          break;
        case 'less_than':
          query[field] = { $lt: value };
          break;
        case 'contains':
          query[field] = { $regex: value, $options: 'i' };
          break;
        default:
          console.warn(`Unsupported operator: ${operator}`);
      }
    });

    // ✅ Fetch matching customers
    const count = await Customer.countDocuments(query);

    res.json({ size: count });

  } catch (error) {
    console.error('Error in /api/preview-audience:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
});

app.use("/api/email", emailRoutes);
// Connect to DB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected');
    app.listen(5000, () => console.log('Server running on port 5000'));
  })
  .catch(err => console.log(err));
