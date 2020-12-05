const { Router } = require('express');

const container = require('../../container');
const adminAuthenticationMiddleware = require('../../middlewares/adminAuthentication');
const wrap = require('../../utils/wrapRoute');

const router = Router();

router.use('/', adminAuthenticationMiddleware);

router.get('/dashboard', wrap(async (request, response) => {
  await container.cradle.getDashboardController.handle(request, response);
}));

module.exports = router;
