/* eslint-disable linebreak-style */
import jwt from 'jsonwebtoken';
import constants from '../config/constants';

export default function authenticate(req, res, next) {
  // Get token from the header
  const token = req.header('Authorization');

  // Check if no token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }
  // verify token
  try {
    const decoded = jwt.verify(token, constants.security.sessionSecret);
    req.user = decoded.user;
    next();
  } catch (err) {
    return res.status(401).json({ msg: 'Token is no valid' });
  }
}
