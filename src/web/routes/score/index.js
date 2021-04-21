const { Router } = require('express');
const container = require('../../../container');
const publishTokenAuthenticationMiddleware = require('../../../middlewares/publishTokenAuthentication');
const wrap = require('../../../utils/wrapRoute');

const router = Router();

router.use('/', publishTokenAuthenticationMiddleware);

router.post('/undo', wrap(async (request, response) => {
  await container.cradle.undoScoreController.handle(request, response);
}));

router.post('/redo', wrap(async (request, response) => {
  await container.cradle.redoScoreController.handle(request, response);
}));

module.exports = router;
