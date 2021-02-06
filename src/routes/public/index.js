const { Router } = require('express');
const container = require('../../container');
const coordinatorOrPublicAuthenticationMiddleware = require('../../middlewares/coordinatorOrPublicAuthentication');
const wrap = require('../../utils/wrapRoute');

const router = Router();

router.get('/getAcademyBySubdomain/:subdomain', wrap(async (request, response) => {
  await container.cradle.getAcademyBySubdomainController.handle(request, response);
}));

router.get('/getMatchesByAcademyId/:academyId', wrap(async (request, response) => {
  await container.cradle.listPublicMatchesController.handle(request, response);
}));

router.post('/changeControl', wrap(async (request, response) => {
  await container.cradle.changeControlController.handle(request, response);
}));

router.get('/getMatchById/:matchId', coordinatorOrPublicAuthenticationMiddleware, wrap(async (request, response) => {
  await container.cradle.getMatchByIdController.handle(request, response);
}));

router.post('/checkPin', wrap(async (request, response) => {
  await container.cradle.checkPinController.handle(request, response);
}));

module.exports = router;
