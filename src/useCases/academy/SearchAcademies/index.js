const academyRepository = require('../../../repositories/academyRepository').instance;
const SearchAcademiesUseCase = require('./SearchAcademiesUseCase');
const SearchAcademiesController = require('./SearchAcademiesController');

const searchAcademiesUseCase = new SearchAcademiesUseCase(academyRepository);
const searchAcademiesController = new SearchAcademiesController(searchAcademiesUseCase);

module.exports = searchAcademiesController;
