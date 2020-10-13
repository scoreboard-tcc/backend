const { Router } = require('express');

const administrationRouter = require('./administration');

const router = Router();

router.use('/administration', administrationRouter);

module.exports = router;
