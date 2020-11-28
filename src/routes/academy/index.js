const { Router } = require('express');
const publicRouter = require('./public');

const router = Router();

router.use('/public', publicRouter);

module.exports = router;
