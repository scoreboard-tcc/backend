const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  matchId: Number,
  sequence: Number,
  playerId: Number,
  playerName: String,
  scoreType: String,
  set1A: Number,
  set1B: Number,
  set2A: Number,
  set2B: Number,
  set3A: Number,
  set3B: Number,
  scoreA: String,
  scoreB: String,
  currentSet: Number,
  setsWonA: Number,
  setsWonB: Number,
  playerServing: Number,
  matchWinner: Number,
  currentState: String,
}, {
  timestamps: true,
});

module.exports = mongoose.model('ScoreLog', schema);
