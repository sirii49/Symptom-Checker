const jwt = require('jsonwebtoken');

const SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

function auth(req, res, next) {
  const token = (req.headers.authorization || '').replace('Bearer ', '');
  try {
    req.user = jwt.verify(token, SECRET); // { id, name }
    next();
  } catch {
    res.status(401).json({ error: 'Please log in to continue' });
  }
}

auth.sign = (user) => jwt.sign({ id: String(user._id), name: user.name }, SECRET, { expiresIn: '7d' });
module.exports = auth;
