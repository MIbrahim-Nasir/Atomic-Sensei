import jwt from 'jsonwebtoken';
import User from '../models/UserModel.js';

export const requireAuth = async (req, res, next) => {
  // Verify authentication
  const { authorization } = req.headers;

  if (!authorization) {
    return res.status(401).json({ error: 'Authorization token required' });
  }

  // Format should be: "Bearer token"
  const token = authorization.split(' ')[1];

  try {
    // Verify the token
    const { userId } = jwt.verify(token, process.env.JWT_SECRET);

    // Add user to request object
    req.user = await User.findById(userId).select('_id');
    
    if (!req.user) {
      return res.status(401).json({ error: 'User not found' });
    }
    
    next();
  } catch (error) {
    console.error('Authentication error:', error);
    res.status(401).json({ error: 'Request is not authorized' });
  }
};