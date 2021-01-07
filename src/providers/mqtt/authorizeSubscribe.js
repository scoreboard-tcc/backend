const MatchRepository = require('../../repositories/matchRepository');
const ScoreboardRepository = require('../../repositories/scoreboardRepository');
const keyv = require('../keyv');

const scoreboardRepository = new ScoreboardRepository();
const matchRepository = new MatchRepository();

/**
 * @param serialNumber
 * @param match
 */
function registerTopicForwarding(serialNumber, match) {
  keyv.set(serialNumber, match.brokerTopic, match.duration * 60 * 1000);
  keyv.set(match.brokerTopic, serialNumber, match.duration * 60 * 1000);
}

/**
 * @param brokerTopic
 */
async function checkIfMatchExists(brokerTopic) {
  const match = await matchRepository.findByBrokerTopicAndIngame(brokerTopic);

  if (!match) {
    throw new Error('Partida não encontrada');
  }
}

/**
 * @param client
 * @param subscription
 * @param callback
 */
async function authorizeSubscribe(client, subscription, callback) {
  try {
    const [topic] = subscription.topic.split('/');

    const scoreboard = await scoreboardRepository.findBySerialNumberAndActive(topic);

    if (!scoreboard) {
      await checkIfMatchExists(topic);

      return callback(null, subscription);
    }

    const match = await matchRepository.findByScoreboardIdAndIngame(scoreboard.id);

    if (!match) {
      return callback(new Error('Partida não encontrada'));
    }

    registerTopicForwarding(topic, match);

    return callback(null, subscription);
  } catch (error) {
    return callback(new Error('Erro ao se inscrever'));
  }
}

module.exports = authorizeSubscribe;
