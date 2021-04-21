const { Router } = require('express');
const container = require('../../../container');
const brokerTopicAuthentication = require('../../../middlewares/brokerTopicAuthentication');
const wrap = require('../../../utils/wrapRoute');

const router = Router();

router.use('/', brokerTopicAuthentication);

router.get('/', wrap(async (request, response) => {
  await container.cradle.getLogsController.handle(request, response);
}));

module.exports = router;
