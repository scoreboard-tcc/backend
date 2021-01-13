const ScoreRepository = require('../../../repositories/scoreRepository');
const validateSchema = require('../../../utils/validation');
const IncrementControllerSequenceValidator = require('./IncrementControllerSequenceValidator');

class IncrementControllerSequenceUseCase {
  /**
   * IncrementControllerSequenceUseCase
   *
   * @class
   * @param {object} container - Container
   * @param container.broker
   * @param {ScoreRepository} container.scoreRepository - ScoreRepository
   */
  constructor({ scoreRepository, broker }) {
    this.scoreRepository = scoreRepository;
    this.broker = broker;
  }

  validate(request) {
    validateSchema(IncrementControllerSequenceValidator, request);
  }

  async execute(match) {
    this.validate(match);

    const sequence = await this.scoreRepository.incrementAndGetControllerSequence(match.id);

    this.publishControllerSequence(match.topic, sequence);

    return sequence;
  }

  async publishControllerSequence(topic, sequence) {
    this.broker.publish({
      topic: `${topic}/Controller_Sequence`,
      payload: Buffer.from(sequence.toString()),
      qos: 1,
      retain: true,
    });
  }
}

module.exports = IncrementControllerSequenceUseCase;
