const schedule = require('node-schedule');

const container = require('../container');

const matchRepository = container.resolve('matchRepository');
const finishMatchUseCase = container.resolve('finishMatchUseCase');

/**
 *
 */
async function execute() {
  const ingameMatches = await matchRepository.findByIngame();
  console.log('LIMPANDO!!!', new Date());

  ingameMatches.forEach((match) => {
    finishMatchUseCase.execute(match);
  });
}

schedule.scheduleJob('0 0 3 * * *', () => execute());
