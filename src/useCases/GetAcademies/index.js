const AcademyRepository = require('../../repositories/academyRepository');
const GetAcademiesUseCase = require('./GetAcademiesUseCase');
const GetAcademiesController = require('./GetAcademiesController');

const academyRepository = new AcademyRepository();
const getAcademiesUseCase = new GetAcademiesUseCase(academyRepository);
const getAcademiesController = new GetAcademiesController(getAcademiesUseCase);

module.exports = getAcademiesController;
