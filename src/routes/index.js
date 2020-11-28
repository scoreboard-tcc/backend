const { Router } = require('express');

const academyRouter = require('./academy');
const administrationRouter = require('./administration');

const router = Router();

router.use('/academy', academyRouter);
router.use('/administration', administrationRouter);

module.exports = router;
