const { addMinutes, addSeconds } = require('date-fns');
const schedule = require('node-schedule');
const MatchRepository = require('../../../repositories/matchRepository');

class ScheduleFinishUseCase {
  /**
   * ScheduleFinishUseCase
   *
   * @class
   * @param {object} container - Container
   * @param container.broker
   * @param {MatchRepository} container.matchRepository - MatchRepository
   */
  constructor({ matchRepository, broker }) {
    this.matchRepository = matchRepository;
    this.broker = broker;
  }

  async execute(match) {
    const finishDate = addMinutes(match.startedAt, match.duration);

    schedule.scheduleJob(finishDate, async () => {
      await this.matchRepository.updateMatchById(match.id, {
        status: 'FINISHED',
      });

      this.clearRetainedMessages(match.brokerTopic);

      if (match.scoreboard) {
        this.clearRetainedMessages(match.scoreboard.serialNumber);
      }
    });
  }

  clearRetainedMessages(brokerTopic) {
    const topics = [
      'Set1_A',
      'Set1_B',
      'Set2_A',
      'Set2_B',
      'Set3_A',
      'Set3_B',
      'Score_A',
      'Score_B',
      'Current_Set',
      'SetsWon_A',
      'SetsWon_B',
      'Controller_Sequence',
      'Player_Serving'];

    topics.forEach((topic) => this.broker.publish({
      topic: `${brokerTopic}/${topic}`,
      payload: null,
      qos: 1,
      retain: true,
    }));
  }
}

module.exports = ScheduleFinishUseCase;
