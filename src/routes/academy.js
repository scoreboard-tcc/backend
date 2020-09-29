const { Router } = require('express');
const multer = require('multer');
const container = require('../container');
const { transactionMiddleware } = require('../middlewares/transaction');
const wrap = require('../utils/wrapRoute');

const upload = multer();

const router = Router();

router.get('/', wrap(async (request, response) => {
  await container.cradle.searchAcademiesController.handle(request, response);
}));

router.get('/:id', wrap(async (request, response) => {
  await container.cradle.getAcademyByIdController.handle(request, response);
}));

router.get('/:id/scoreboards', wrap(async (request, response) => {
  await container.cradle.searchScoreboardsController.handle(request, response);
}));

router.post('/:id/scoreboards', wrap(async (request, response) => {
  await container.cradle.createScoreboardController.handle(request, response);
}));

router.put('/:id',
  upload.single('logo'),
  wrap(async (request, response) => {
    await container.cradle.updateAcademyController.handle(request, response);
  }));

router.get('/checkSubdomain/:subdomain', wrap(async (request, response) => {
  await container.cradle.checkIfSubdomainIsAvailableController.handle(request, response);
}));

router.post('/',
  upload.single('logo'),
  transactionMiddleware,
  wrap(async (request, response, next) => {
    await container.cradle.createAcademyController.handle(request, response, next);
  }));

router.post('/:id/coordinators', wrap(async (request, response) => {
  await container.cradle.createCoordinatorController.handle(request, response);
}));

router.get('/:id/coordinators', wrap(async (request, response) => {
  await container.cradle.searchCoordinatorsController.handle(request, response);
}));

module.exports = router;
