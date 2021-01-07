const app = require('./app');
const config = require('./config/app');
const broker = require('./providers/mqtt');

require('./providers/mongo');

app.listen(config.port, () => {
  console.log(`App listening at port ${config.port}`);
});

broker.listen();
