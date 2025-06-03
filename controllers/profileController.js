// profileController.js
const User = require('../models/User');

// Fetch user profile information
exports.getUserProfile = async (req, res) => {
  try {
    // Find user by user ID (from JWT token)
    const user = await User.findById(req.userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Send back user info
    res.json({
      name: user.name,
      email: user.email,
      profilePic: user.profilePic,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error fetching user profile' });
  }
};


// profileController.js
exports.updateUserProfile = async (req, res) => {
    const { name, email, profilePic } = req.body;
  
    try {
      // Find user by user ID (from JWT token)
      const user = await User.findById(req.userId);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Update user info
      user.name = name || user.name;
      user.email = email || user.email;
      user.profilePic = profilePic || user.profilePic;
  
      await user.save();
  
      res.json({ message: 'Profile updated successfully', user });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Error updating profile' });
    }
  };
  