const { addMinutes } = require('date-fns');
const schedule = require('node-schedule');
const FinishMatchUseCase = require('../FinishMatch/FinishMatchUseCase');

class ScheduleFinishUseCase {
  /**
   * ScheduleFinishUseCase
   *
   * @class
   * @param {object} container - Container
   * @param {FinishMatchUseCase} container.finishMatchUseCase - FinishMatchUseCase
   */
  constructor({ finishMatchUseCase }) {
    this.finishMatchUseCase = finishMatchUseCase;
  }

  async execute(match) {
    const finishDate = addMinutes(match.startedAt, match.duration);

    schedule.scheduleJob(finishDate, async () => {
      await this.finishMatchUseCase.execute(match);
    });
  }
}

module.exports = ScheduleFinishUseCase;
