const { Router } = require('express');

const container = require('../../../container');
const coordinationAuthenticationMiddleware = require('../../../middlewares/coordinatorAuthentication');
const wrap = require('../../../utils/wrapRoute');

const router = Router();

router.use('/', coordinationAuthenticationMiddleware);

router.post('/', wrap(async (request, response) => {
  await container.cradle.createMatchController.handle(request, response);
}));

router.get('/scoreboards', wrap(async (request, response) => {
  await container.cradle.listScoreboardsWithMatchesController.handle(request, response);
}));

router.get('/virtual', wrap(async (request, response) => {
  await container.cradle.listVirtualMatchesController.handle(request, response);
}));

router.post('/takeControl', wrap(async (request, response) => {
  await container.cradle.takeControlController.handle(request, response);
}));

router.post('/finish/:matchId', wrap(async (request, response) => {
  await container.cradle.finishMatchController.handle(request, response);
}));

module.exports = router;
