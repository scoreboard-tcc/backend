const app = require('./app');
const config = require('./config/app');

require('./providers/mongo');
require('./providers/mqtt');
require('./jobs/scheduleMatchesFinish');

app.listen(config.port, () => {
  console.log(`App listening at port ${config.port}`);
});
