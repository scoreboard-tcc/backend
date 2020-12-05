const { Router } = require('express');
const container = require('../../container');
const wrap = require('../../utils/wrapRoute');

const router = Router();

router.post('/admin', wrap(async (request, response) => {
  await container.cradle.authenticateAdminController.handle(request, response);
}));

router.post('/coordinator', wrap(async (request, response) => {
  await container.cradle.authenticateCoordinatorController.handle(request, response);
}));

module.exports = router;
