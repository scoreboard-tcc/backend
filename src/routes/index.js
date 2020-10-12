const { Router } = require('express');
const academyRouter = require('./academy');
const scoreboardRouter = require('./scoreboard');
const coordinatorRouter = require('./coordinator');
const authenticationRouter = require('./authentication');

const router = Router();

router.use('/academy', academyRouter);
router.use('/scoreboard', scoreboardRouter);
router.use('/coordinator', coordinatorRouter);
router.use('/authentication', authenticationRouter);

module.exports = router;
