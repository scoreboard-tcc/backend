const { isAfter, addMinutes } = require('date-fns');
const container = require('../container');

const matchRepository = container.resolve('matchRepository');
const scheduleFinishUseCase = container.resolve('scheduleFinishUseCase');
const finishMatchUseCase = container.resolve('finishMatchUseCase');

/**
 *
 */
async function execute() {
  const ingameMatches = await matchRepository.findByIngame();

  ingameMatches.forEach((match) => {
    const finishDate = addMinutes(match.startedAt, match.duration);

    if (isAfter(new Date(), finishDate)) {
      finishMatchUseCase.execute(match);
    } else {
      scheduleFinishUseCase.execute(match);
    }
  });
}

execute();
