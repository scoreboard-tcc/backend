const { Router } = require('express');

const academyRouter = require('./academy');
const authenticationRouter = require('./authentication');
const coordinatorRouter = require('./coordinator');
const matchRouter = require('./match');
const playerRouter = require('./player');
const publicRouter = require('./public');
const scoreRouter = require('./score');
const scoreboardRouter = require('./scoreboard');
const serviceRouter = require('./service');

const router = Router();

router.use('/academy', academyRouter);
router.use('/authentication', authenticationRouter);
router.use('/coordinator', coordinatorRouter);
router.use('/match', matchRouter);
router.use('/player', playerRouter);
router.use('/public', publicRouter);
router.use('/score', scoreRouter);
router.use('/scoreboard', scoreboardRouter);
router.use('/service', serviceRouter);

module.exports = router;
