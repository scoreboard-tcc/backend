const { Router } = require('express');
const academyRouter = require('./academy');
const authenticationRouter = require('./authentication');
const scoreboardRouter = require('./scoreboard');
const coordinatorRouter = require('./coordinator');
const wrap = require('../../utils/wrapRoute');
const container = require('../../container');

const router = Router();

router.use('/academy', academyRouter);
router.use('/authentication', authenticationRouter);
router.use('/scoreboard', scoreboardRouter);
router.use('/coordinator', coordinatorRouter);

router.get('/dashboard', wrap(async (request, response) => {
  await container.cradle.getDashboardController.handle(request, response);
}));

module.exports = router;
