const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  matchId: Number,
  scoreSequence: Number,
  controllerSequence: Number,
}, {
  timestamps: true,
});

module.exports = mongoose.model('MatchLog', schema);
