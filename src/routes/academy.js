const { Router } = require('express');
const getAcademiesController = require('../useCases/GetAcademies');
const wrap = require('../utils/wrapRoute');

const router = Router();

router.get('/', wrap(async (request, response) => {
  await getAcademiesController.handle(request, response);
}));

module.exports = router;
