const router = require('express').Router();
const runEngine = require('../engine/ruleEngine');
const store = require('../store');

router.post('/', async (req, res, next) => {
  try {
    const { symptoms, ageGroup = 'adult', duration = '1 day', severity = 'mild' } = req.body;
    if (!Array.isArray(symptoms) || symptoms.length === 0) {
      return res.status(400).json({ error: 'Select at least one symptom' });
    }
    const result = runEngine({ symptoms, ageGroup, severity, duration });
    const saved = await store.add({ userId: req.user.id, ageGroup, duration, severity, ...result });
    res.status(201).json(saved);
  } catch (err) { next(err); }
});

module.exports = router;
