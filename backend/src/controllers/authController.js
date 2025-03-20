const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Helper function to generate token
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: '7d' });
};

exports.register = async (req, res) => {
  const { email, password, name } = req.body;
  try {
    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ msg: 'User already exists' });

    user = new User({ email, password, name });
    await user.save();

    const token = generateToken(user._id);
    
    res.json({ 
      token, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name || email.split('@')[0]
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: 'Invalid credentials' });

    const isMatch = await user.matchPassword(password);
    if (!isMatch) return res.status(400).json({ msg: 'Invalid credentials' });

    const token = generateToken(user._id);
    
    res.json({ 
      token, 
      user: {
        id: user._id,
        email: user.email,
        name: user.name || email.split('@')[0]
      }
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get current user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) return res.status(404).json({ msg: 'User not found' });
    
    res.json({
      id: user._id,
      email: user.email,
      name: user.name || user.email.split('@')[0]
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};