const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const { Schema } = mongoose;

const schema = new Schema({
  matchId: Number,
  message: String,
  type: String,
}, {
  timestamps: true,
});

schema.plugin(mongoosePaginate);

module.exports = mongoose.model('MessageLog', schema);
