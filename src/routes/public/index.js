const { Router } = require('express');
const container = require('../../container');
const wrap = require('../../utils/wrapRoute');

const router = Router();

router.get('/getAcademyBySubdomain/:subdomain', wrap(async (request, response) => {
  await container.cradle.getAcademyBySubdomainController.handle(request, response);
}));

router.get('/getMatchesByAcademyId/:academyId', wrap(async (request, response) => {
  await container.cradle.listPublicMatchesController.handle(request, response);
}));

router.get('/changeControl', wrap(async (request, response) => {
  await container.cradle.changeControlController.handle(request, response);
}));

router.get('/getMatchById/:matchId', wrap(async (request, response) => {
  await container.cradle.getMatchByIdController.handle(request, response);
}));

module.exports = router;
