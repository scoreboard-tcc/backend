const { Router } = require('express');

const authenticationRouter = require('./authentication');
const publicRouter = require('./public');

const router = Router();

router.use('/authentication', authenticationRouter);
router.use('/public', publicRouter);

module.exports = router;
