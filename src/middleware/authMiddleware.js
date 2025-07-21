const jwt = require('jsonwebtoken');
const prisma = require('../prisma/client');
const { jwtSecret } = require('../config');

module.exports = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader?.split(' ')[1];

    if (!token) {
      return res.status(401).json({ message: 'Missing token' });
    }

    const decoded = jwt.verify(token, jwtSecret);

    const user = await prisma.user.findUnique({
      where: { id: decoded.id },
    });

    if (!user) {
      return res.status(401).json({ message: 'User does not exists' });
    }
    if (user && !user.isVerified) {
      return res.status(401).json({ message: 'User does not exists' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth Middleware Error:', err);
    return res.status(403).json({ message: 'Invalid or expired token' });
  }
};
