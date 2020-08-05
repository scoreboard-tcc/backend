const { Router } = require('express');
const academyRouter = require('./academy');

const router = Router();

router.use('/academy', academyRouter);

module.exports = router;
