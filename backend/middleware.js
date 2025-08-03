const jwt = require('jsonwebtoken');

const SECRET = 'supersecret';

function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

function rolesGuard(requiredRole) {
  return (req, res, next) => {
    if (!req.user || req.user.role !== requiredRole) {
      return res.sendStatus(403);
    }
    next();
  };
}

module.exports = { authenticateJWT, rolesGuard, SECRET };
