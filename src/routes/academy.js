const { Router } = require('express');
const container = require('../container');
const wrap = require('../utils/wrapRoute');

const router = Router();

router.get('/', wrap(async (request, response) => {
  await container.cradle.searchAcademiesController.handle(request, response);
}));

module.exports = router;
