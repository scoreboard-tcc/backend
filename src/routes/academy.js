const { Router } = require('express');
const searchAcademiesController = require('../useCases/academy/SearchAcademies');
const wrap = require('../utils/wrapRoute');

const router = Router();

router.get('/', wrap(async (request, response) => {
  await searchAcademiesController.handle(request, response);
}));

module.exports = router;
