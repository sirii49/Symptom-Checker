// MongoDB storage (Mongoose). Same function names as before, so routes are unchanged.
const mongoose = require('mongoose');
const User = require('./models/User');
const Check = require('./models/Check');

module.exports = {
  // ---- users ----
  async findUser(email) {
    return User.findOne({ email });
  },
  async createUser(data) {
    return User.create(data);
  },

  // ---- history (always scoped to one user) ----
  async list(userId) {
    return Check.find({ userId }).sort({ createdAt: -1 }).lean();
  },
  async add(doc) {
    const rec = await Check.create(doc);
    return rec.toObject();
  },
  async remove(id, userId) {
    if (!mongoose.isValidObjectId(id)) return;
    await Check.deleteOne({ _id: id, userId });
  },
  async clear(userId) {
    await Check.deleteMany({ userId });
  },
};
