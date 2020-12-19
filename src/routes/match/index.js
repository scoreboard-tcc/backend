const { Router } = require('express');

const container = require('../../container');
const coordinationAuthenticationMiddleware = require('../../middlewares/coordinatorAuthentication');
const wrap = require('../../utils/wrapRoute');

const router = Router();

router.use('/', coordinationAuthenticationMiddleware);

router.post('/', wrap(async (request, response) => {
  await container.cradle.createMatchController.handle(request, response);
}));

module.exports = router;
