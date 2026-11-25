require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db');
const auth = require('./middleware/auth');

const app = express();
app.use(cors());
app.use(express.json());

app.get('/api/health', (req, res) => res.json({ ok: true }));
app.use('/api/auth', require('./routes/auth'));
app.use('/api/symptoms', auth, require('./routes/symptoms'));
app.use('/api/check', auth, require('./routes/check'));
app.use('/api/history', auth, require('./routes/history'));

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).json({ error: 'Something went wrong on the server' });
});

const PORT = process.env.PORT || 5000;
connectDB().then(() => {
  app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
});
