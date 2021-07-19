/* eslint-disable linebreak-style */
export default function adminAuth(req, res, next) {
  // Check the user role
  if (req.user.role === 'admin') {
    next();
  } else {
    return res.status(403).json({ msg: 'Access denied. No permission to access!' });
  }
}
