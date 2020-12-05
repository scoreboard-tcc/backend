const { Router } = require('express');

const administrationRouter = require('./administration');
const coordinationRouter = require('./coordination');

const router = Router();

router.use('/administration', administrationRouter);
router.use('/coordination', coordinationRouter);

module.exports = router;
