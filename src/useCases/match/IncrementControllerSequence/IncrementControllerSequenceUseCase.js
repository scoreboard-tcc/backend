const { broker } = require('../../../providers/mqtt');
const ScoreRepository = require('../../../repositories/scoreRepository');
const validateSchema = require('../../../utils/validation');
const IncrementControllerSequenceValidator = require('./IncrementControllerSequenceValidator');

class IncrementControllerSequenceUseCase {
  /**
   * IncrementControllerSequenceUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {ScoreRepository} container.scoreRepository - ScoreRepository
   */
  constructor({ scoreRepository }) {
    this.scoreRepository = scoreRepository;
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
    broker.publish({
      topic: `${topic}/Controller_Sequence`,
      payload: Buffer.from(sequence.toString()),
      qos: 1,
      retain: true,
    });
  }
}

module.exports = IncrementControllerSequenceUseCase;
