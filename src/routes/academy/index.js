const { Router } = require('express');
const multer = require('multer');

const container = require('../../container');
const adminAuthenticationMiddleware = require('../../middlewares/adminAuthentication');
const wrap = require('../../utils/wrapRoute');

const upload = multer();
const router = Router();

router.use('/', adminAuthenticationMiddleware);

router.get('/checkIfSubdomainIsAvailable/:subdomain', wrap(async (request, response) => {
  await container.cradle.checkIfSubdomainIsAvailableController.handle(request, response);
}));

router.post('/',
  upload.single('logo'),
  wrap(async (request, response, next) => {
    await container.cradle.createAcademyController.handle(request, response, next);
  }));

router.get('/:id', wrap(async (request, response) => {
  await container.cradle.getAcademyByIdController.handle(request, response);
}));

router.get('/', wrap(async (request, response) => {
  await container.cradle.searchAcademiesController.handle(request, response);
}));

router.put('/:id',
  upload.single('logo'),
  wrap(async (request, response) => {
    await container.cradle.updateAcademyController.handle(request, response);
  }));

module.exports = router;
