const awilix = require('awilix');
const AcademyRepository = require('../repositories/academyRepository');
const SearchAcademiesController = require('../useCases/academy/SearchAcademies/SearchAcademiesController');
const SearchAcademiesUseCase = require('../useCases/academy/SearchAcademies/SearchAcademiesUseCase');

const container = awilix.createContainer();

const singletonClass = (c) => awilix.asClass(c, { lifetime: awilix.Lifetime.SINGLETON });

container.register({
  academyRepository: singletonClass(AcademyRepository),
});

container.register({
  searchAcademiesController: singletonClass(SearchAcademiesController),
  searchAcademiesUseCase: singletonClass(SearchAcademiesUseCase),
});

module.exports = container;
