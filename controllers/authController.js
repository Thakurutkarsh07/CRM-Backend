const { OAuth2Client } = require('google-auth-library');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Initialize the Google OAuth client
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const client = new OAuth2Client(CLIENT_ID);

exports.googleLogin = async (req, res) => {
  const { token } = req.body;

  if (!token) {
    return res.status(400).json({ message: 'No token provided' });
  }

  try {
    // Verify the Google token
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID,  // Ensure the token is for your app
    });

    // Get user info from the token
    const payload = ticket.getPayload();
    const { sub, name, email, picture } = payload;

    // Check if the user already exists in the database
    let user = await User.findOne({ googleId: sub });

    if (!user) {
      // If the user doesn't exist, create a new user
      user = new User({
        googleId: sub,
        name,
        email,
        profilePic: picture,
      });
      await user.save();
    }

    // Generate a JWT token for the user
    const authToken = jwt.sign({ userId: user._id }, process.env.JWT_SECRET_KEY, { expiresIn: '1h' });

    // Send back the JWT token and user data
    const decoded = jwt.decode(authToken);
    res.json({
      token: authToken,
      user,
      expiresAt: decoded.exp * 1000 // convert to milliseconds
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to authenticate' });
  }
};
