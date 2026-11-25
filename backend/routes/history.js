const router = require('express').Router();
const store = require('../store');

router.get('/', async (req, res, next) => {
  try { res.json(await store.list(req.user.id)); } catch (e) { next(e); }
});
router.delete('/', async (req, res, next) => {
  try { await store.clear(req.user.id); res.json({ message: 'History cleared' }); } catch (e) { next(e); }
});
router.delete('/:id', async (req, res, next) => {
  try { await store.remove(req.params.id, req.user.id); res.json({ message: 'Deleted' }); } catch (e) { next(e); }
});

module.exports = router;
