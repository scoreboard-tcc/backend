const container = require('../container');

const matchRepository = container.resolve('matchRepository');
const scheduleFinishUseCase = container.resolve('scheduleFinishUseCase');

/**
 *
 */
async function execute() {
  const ingameMatches = await matchRepository.findByIngame();

  ingameMatches.forEach((match) => scheduleFinishUseCase.execute(match));
}

execute();
