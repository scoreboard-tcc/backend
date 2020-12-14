const CreateAcademyUseCase = require('./CreateAcademyUseCase');

class CreateAcademyController {
  /**
   * CreateAcademyController
   *
   * @class
   * @param {object} container - Container
   * @param {CreateAcademyUseCase} container.createAcademyUseCase - CreateAcademyUseCase
   */
  constructor({ createAcademyUseCase }) {
    this.createAcademyUseCase = createAcademyUseCase;
  }

  async handle(request, response, next) {
    const parsedBody = {
      ...request.body,
      scoreboards: JSON.parse(request.body.scoreboards),
      coordinator: JSON.parse(request.body.coordinator),
      logo: request.file,
    };

    const academy = await this.createAcademyUseCase.execute(parsedBody);

    response.status(201).json(academy);

    return next();
  }
}

module.exports = CreateAcademyController;
