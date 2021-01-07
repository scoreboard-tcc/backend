const MatchRepository = require('../../repositories/matchRepository');
const ScoreboardRepository = require('../../repositories/scoreboardRepository');

const keyv = require('../keyv');

const scoreboardRepository = new ScoreboardRepository();
const matchRepository = new MatchRepository();

/**
 * @param broker
 */
function buildAuthorizePublish(broker) {
  /**
   * @param topic
   * @param field
   * @param packet
   */
  async function forwardPacketIfNeeded(topic, field, packet) {
    const forwardToTopic = await keyv.get(topic);

    if (forwardToTopic) {
      broker.publish({
        topic: `${forwardToTopic}/${field}`,
        payload: packet.payload,
        qos: 1,
        retain: true,
      });
    }
  }

  /**
   * @param topic
   * @param token
   */
  async function checkPermissionToPublish(topic, token) {
    const scoreboard = await scoreboardRepository.findBySerialNumberAndStaticTokenAndActive(topic, token);

    if (scoreboard) {
      return;
    }

    const match = await matchRepository.findMatchByBrokerTopicAndPublishTokenAndIngame(topic, token);

    if (!match) {
      throw new Error('Partida não encontrada');
    }
  }

  /**
   * @param client
   * @param packet
   * @param callback
   */
  async function authorizePublish(client, packet, callback) {
    try {
      const [topic, field] = packet.topic.split('/');

      if (!topic || !field) {
        return callback(new Error('Erro'));
      }

      if (field === 'Publisher') {
        return callback(new Error('Erro'));
      }

      const data = JSON.parse(packet.payload.toString());

      if (!data || !data.publishToken) {
        return callback(new Error('Erro'));
      }

      await checkPermissionToPublish(topic, data.publishToken);

      // eslint-disable-next-line no-param-reassign
      packet.payload = Buffer.from(data.payload);

      await forwardPacketIfNeeded(topic, field, packet);

      return callback(null);

      // TODO: verificar o ScoreConfirmation
    } catch (error) {
      console.log(error);
      return callback(new Error('Error'));
    }
  }

  return authorizePublish;
}

module.exports = buildAuthorizePublish;
