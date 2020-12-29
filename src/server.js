const app = require('./app');
const config = require('./config/app');
const broker = require('./providers/mqtt');

app.listen(config.port, () => {
  console.log(`App listening at port ${config.port}`);
});

broker.listen();
