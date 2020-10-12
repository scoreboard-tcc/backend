const { Router } = require('express');
const wrap = require('../utils/wrapRoute');

const container = require('../container');

const router = Router();

router.post('/admin', wrap(async (request, response) => {
  await container.cradle.authenticateAdminController.handle(request, response);
}));

module.exports = router;
