const { Router } = require('express');
const academyRouter = require('./academy');
const scoreboardRouter = require('./scoreboard');
const coordinatorRouter = require('./coordinator');

const router = Router();

router.use('/academy', academyRouter);
router.use('/scoreboard', scoreboardRouter);
router.use('/coordinator', coordinatorRouter);

module.exports = router;
