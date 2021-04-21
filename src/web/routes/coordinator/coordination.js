const { Router } = require('express');

const container = require('../../../container');
const coordinatorAuthenticationMiddleware = require('../../../middlewares/coordinatorAuthentication');
const wrap = require('../../../utils/wrapRoute');

const router = Router();

router.use('/', coordinatorAuthenticationMiddleware);

router.post('/', wrap(async (request, response) => {
  await container.cradle.createCoordinatorController.handle(request, response);
}));

router.get('/', wrap(async (request, response) => {
  await container.cradle.searchCoordinatorsController.handle(request, response);
}));

router.put('/:id', wrap(async (request, response) => {
  await container.cradle.updateCoordinatorController.handle(request, response);
}));

router.delete('/:id', wrap(async (request, response) => {
  await container.cradle.deleteCoordinatorController.handle(request, response);
}));

module.exports = router;
