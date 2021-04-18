const ScoreRepository = require('../../../repositories/scoreRepository');
const IncrementControllerSequenceValidator = require('./IncrementControllerSequenceValidator');

class IncrementControllerSequenceUseCase {
  /**
   * IncrementControllerSequenceUseCase
   *
   * @class
   * @param {object} container - Container
   * @param container.broker
   * @param  {IncrementControllerSequenceValidator} container.incrementControllerSequenceValidator
   * @param {ScoreRepository} container.scoreRepository - ScoreRepository
   */
  constructor({ scoreRepository, broker, incrementControllerSequenceValidator }) {
    this.scoreRepository = scoreRepository;
    this.broker = broker;
    this.incrementControllerSequenceValidator = incrementControllerSequenceValidator;
  }

  async execute(match) {
    this.incrementControllerSequenceValidator.validate(match);

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
