const router = require('express').Router();
router.get('/', (req, res) => res.json(require('../data/symptoms.json')));
module.exports = router;
