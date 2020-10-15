const app = require('./app');
const config = require('./config/app');

app.listen(config.port, () => {
  console.log(`App listening at port ${config.port}`);
});
