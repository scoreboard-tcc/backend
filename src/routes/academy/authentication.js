const { Router } = require('express');
const wrap = require('../../utils/wrapRoute');

const container = require('../../container');

const router = Router();

router.post('/', wrap(async (request, response) => {
  await container.cradle.authenticateCoordinatorController.handle(request, response);
}));

module.exports = router;
