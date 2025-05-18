import User from '../models/UserModel.js';
import jwt from 'jsonwebtoken';

const userController = {
  // Create JWT token for authentication
  createToken: (userId) => {
    return jwt.sign({ userId }, process.env.JWT_SECRET, {
      expiresIn: '7d'
    });
  },

  // User signup
  signup: async (req, res) => {
    const { username, password, email, age, educationLevel, currentKnowledge } = req.body;
    
    try {
      // Pass currentKnowledge to the signup method
      const user = await User.signup(username, password, email, age, educationLevel, currentKnowledge);
      const token = userController.createToken(user._id);
      
      res.status(201).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        educationLevel: user.educationLevel,
        preferredContentType: user.preferredContentType,
        token
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // User signin
  signin: async (req, res) => {
    const { username, password } = req.body;
    
    try {
      const user = await User.signin(username, password);
      
      // Update last active timestamp
      user.lastActive = Date.now();
      await user.save();
      
      const token = userController.createToken(user._id);
      
      res.status(200).json({
        _id: user._id,
        username: user.username,
        email: user.email,
        age: user.age,
        educationLevel: user.educationLevel,
        preferredContentType: user.preferredContentType,
        token
      });
    } catch (error) {
      res.status(401).json({ error: error.message });
    }
  },

  // Get user profile
  getProfile: async (req, res) => {
    try {
      const user = await User.findById(req.user._id).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to retrieve profile' });
    }
  },

  // Update user profile
  updateProfile: async (req, res) => {
    const { email, age, educationLevel, preferredContentType } = req.body;
    
    try {
      const user = await User.findById(req.user._id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      if (email) user.email = email;
      if (age) user.age = age;
      if (educationLevel) user.educationLevel = educationLevel;
      if (preferredContentType) user.preferredContentType = preferredContentType;
      
      const updatedUser = await user.save();
      
      res.status(200).json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        age: updatedUser.age,
        educationLevel: updatedUser.educationLevel,
        preferredContentType: updatedUser.preferredContentType
      });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Change password
  changePassword: async (req, res) => {
    const { currentPassword, newPassword } = req.body;
    
    try {
      const userId = req.user._id;
      await User.changePassword(userId, currentPassword, newPassword);
      res.status(200).json({ message: 'Password updated successfully' });
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  },

  // Delete user account
  deleteAccount: async (req, res) => {
    try {
      const user = await User.findByIdAndDelete(req.user._id);
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(200).json({ message: 'Account deleted successfully' });
    } catch (error) {
      res.status(500).json({ error: 'Failed to delete account' });
    }
  },

  // Update last active timestamp
  updateLastActive: async (req, res) => {
    try {
      const user = await User.findByIdAndUpdate(
        req.user._id, 
        { lastActive: Date.now() }, 
        { new: true }
      ).select('-password');
      
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
      
      res.status(200).json(user);
    } catch (error) {
      res.status(500).json({ error: 'Failed to update activity status' });
    }
  },
};

export default userController;