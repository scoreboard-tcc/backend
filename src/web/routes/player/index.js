const { Router } = require('express');

const container = require('../../../container');
const coordinationAuthenticationMiddleware = require('../../../middlewares/coordinatorAuthentication');
const wrap = require('../../../utils/wrapRoute');

const router = Router();

router.use('/', coordinationAuthenticationMiddleware);

router.post('/', wrap(async (request, response) => {
  await container.cradle.createPlayerController.handle(request, response);
}));

router.get('/', wrap(async (request, response) => {
  await container.cradle.searchPlayersController.handle(request, response);
}));

router.put('/:playerId', wrap(async (request, response) => {
  await container.cradle.linkPlayerToAcademyController.handle(request, response);
}));

router.delete('/:playerId', wrap(async (request, response) => {
  await container.cradle.unlinkPlayerFromAcademyController.handle(request, response);
}));

module.exports = router;
