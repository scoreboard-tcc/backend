const CheckPinUseCase = require('./CheckPinUseCase');

class CheckPinController {
  /**
   * CheckPinController
   *
   * @class
   * @param {object} container - Container
   * @param {CheckPinUseCase} container.checkPinUseCase - CheckPinUseCase
   */
  constructor({ checkPinUseCase }) {
    this.checkPinUseCase = checkPinUseCase;
  }

  async handle(request, response) {
    const result = await this.checkPinUseCase.execute(request.body);

    return response.status(200).json(result);
  }
}

module.exports = CheckPinController;
