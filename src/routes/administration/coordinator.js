const { Router } = require('express');
const container = require('../../container');
const wrap = require('../../utils/wrapRoute');

const router = Router();

router.delete('/:id', wrap(async (request, response) => {
  await container.cradle.deleteCoordinatorController.handle(request, response);
}));

router.put('/:id', wrap(async (request, response) => {
  await container.cradle.updateCoordinatorController.handle(request, response);
}));

module.exports = router;
