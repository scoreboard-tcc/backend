const mongoose = require('mongoose');
const config = require('../../config/mongodb');

mongoose.connect(config.connectionUrl, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
