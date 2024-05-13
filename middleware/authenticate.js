import jwt from 'jsonwebtoken';
import { User } from '../models';

const authenticate = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res
      .status(401)
      .json({ message: 'Authentication token is missing or invalid' });
  }

  const token = authHeader.split(' ')[1];
  jwt.verify(token, process.env.JWT_SECRET, async (err, decoded) => {
    if (err) {
      return res.status(403).json({ message: 'Failed to authenticate token' });
    }

    try {
      const user = await User.findById(decoded.localId)
        .select('email firstName lastName phone role')
        .lean();
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      req.user = user;
      next();
    } catch (error) {
      return res.status(500).json({ message: 'Failed to retrieve user role' });
    }
  });
};

export default authenticate;
