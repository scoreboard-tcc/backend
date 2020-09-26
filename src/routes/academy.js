const { Router } = require('express');
const multer = require('multer');
const container = require('../container');
const { transactionMiddleware } = require('../middlewares/transaction');
const wrap = require('../utils/wrapRoute');

const upload = multer({ dest: 'uploads/' });

const router = Router();

router.get('/', wrap(async (request, response) => {
  await container.cradle.searchAcademiesController.handle(request, response);
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

module.exports = router;
