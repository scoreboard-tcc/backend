const { Router } = require('express');

const container = require('../../../container');
const adminAuthenticationMiddleware = require('../../../middlewares/adminAuthentication');
const wrap = require('../../../utils/wrapRoute');

const router = Router();

router.use('/', adminAuthenticationMiddleware);

router.post('/', wrap(async (request, response) => {
  await container.cradle.createCoordinatorAdminController.handle(request, response);
}));

router.get('/', wrap(async (request, response) => {
  await container.cradle.searchCoordinatorsAdminController.handle(request, response);
}));

router.delete('/:id', wrap(async (request, response) => {
  await container.cradle.deleteCoordinatorAdminController.handle(request, response);
}));

router.put('/:id', wrap(async (request, response) => {
  await container.cradle.updateCoordinatorAdminController.handle(request, response);
}));

module.exports = router;
