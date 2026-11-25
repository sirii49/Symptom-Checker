const mongoose = require('mongoose');

const checkSchema = new mongoose.Schema(
  {
    userId:       { type: String, required: true, index: true },
    ageGroup:     String,
    duration:     String,
    severity:     String,
    symptoms:     [String],
    unrecognized: [String],
    urgency:      { type: String, enum: ['self-care', 'see-doctor', 'emergency'] },
    message:      String,
    conditions:   [{ _id: false, name: String, score: Number, advice: String }],
  },
  { timestamps: true }
);

module.exports = mongoose.model('Check', checkSchema);
