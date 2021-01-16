const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  matchId: Number,
  scoreSequence: Number,
  controllerSequence: Number,
  remainingUndos: Number,
  remainingRedos: Number,
  player1Id: Number,
  player2Id: Number,
  player1Name: String,
  player2Name: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('MatchLog', schema);
