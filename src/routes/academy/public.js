const { Router } = require('express');
const container = require('../../container');
const wrap = require('../../utils/wrapRoute');

const router = Router();

router.get('/getAcademyPublicDataBySubdomain/:subdomain', wrap(async (request, response) => {
  await container.cradle.getAcademyPublicDataBySubdomainController.handle(request, response);
}));

module.exports = router;
