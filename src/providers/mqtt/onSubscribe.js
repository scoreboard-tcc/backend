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
 * @param subscriptions
 * @param client
 */
async function onSubscribe(subscriptions, client) {
  const [subscription] = subscriptions;
  const { topic: fullTopic } = subscription;

  const [topic] = fullTopic.split('/');

  const scoreboard = await scoreboardRepository.findBySerialNumberAndActive(topic);

  if (!scoreboard) {
    return;
  }

  const match = await matchRepository.findByScoreboardIdAndIngame(scoreboard.id);

  if (!match) {
    return;
  }

  registerTopicForwarding(topic, match);
}

module.exports = onSubscribe;
