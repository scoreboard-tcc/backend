const { Router } = require('express');
const academyRouter = require('./academy');
const scoreboardRouter = require('./scoreboard');

const router = Router();

router.use('/academy', academyRouter);
router.use('/scoreboard', scoreboardRouter);

module.exports = router;
