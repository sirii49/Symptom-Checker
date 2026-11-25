const router = require('express').Router();
const bcrypt = require('bcryptjs');
const store = require('../store');
const auth = require('../middleware/auth');

const reply = (res, status, u) =>
  res.status(status).json({ token: auth.sign(u), user: { id: String(u._id), name: u.name, email: u.email } });

router.post('/register', async (req, res, next) => {
  try {
    const name = (req.body.name || '').trim();
    const email = (req.body.email || '').trim().toLowerCase();
    const password = req.body.password || '';
    if (!name) return res.status(400).json({ error: 'Enter your name' });
    if (!/^\S+@\S+\.\S+$/.test(email)) return res.status(400).json({ error: 'Enter a valid email address' });
    if (password.length < 6) return res.status(400).json({ error: 'Password must be at least 6 characters' });
    if (await store.findUser(email)) return res.status(409).json({ error: 'An account with this email already exists' });
    const user = await store.createUser({ name, email, password: bcrypt.hashSync(password, 10) });
    reply(res, 201, user);
  } catch (e) { next(e); }
});

router.post('/login', async (req, res, next) => {
  try {
    const email = (req.body.email || '').trim().toLowerCase();
    const user = await store.findUser(email);
    if (!user || !bcrypt.compareSync(req.body.password || '', user.password)) {
      return res.status(401).json({ error: 'Incorrect email or password' });
    }
    reply(res, 200, user);
  } catch (e) { next(e); }
});

module.exports = router;
