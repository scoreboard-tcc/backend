const mongoose = require('mongoose');

const { Schema } = mongoose;

const schema = new Schema({
  matchId: Number,
  sequence: Number,
  playerId: Number,
  Set1A: Number,
  Set1B: Number,
  Set2A: Number,
  Set2B: Number,
  Set3A: Number,
  Set3B: Number,
  ScoreA: Number,
  ScoreB: Number,
  CurrentSet: Number,
  SetsWonA: Number,
  SetsWonB: Number,
  PlayerServing: Number,
}, {
  timestamps: true,
});

module.exports = mongoose.model('ScoreLog', schema);
