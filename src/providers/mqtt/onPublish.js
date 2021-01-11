/* eslint-disable camelcase */
const keyv = require('../keyv');
const broker = require('./broker');

/**
 * @param topic
 * @param packet
 */
async function publishScoreTopics(topic, packet) {
  try {
    const data = packet.payload.toString();

    const [
      Set1_A,
      Set1_B,
      Set2_A,
      Set2_B,
      Set3_A,
      Set3_B,
      Score_A,
      Score_B,
      Current_Set,
      SetsWon_A,
      SetsWon_B,
      Player_Serving,
    ] = data.split(';');

    const fieldMap = {
      Set1_A,
      Set1_B,
      Set2_A,
      Set2_B,
      Set3_A,
      Set3_B,
      Score_A,
      Score_B,
      Current_Set,
      SetsWon_A,
      SetsWon_B,
      Player_Serving,
    };

    Object.entries(fieldMap)
      .forEach(([field, value]) => broker.publish({
        topic: `${topic}/${field}`,
        payload: Buffer.from(value),
        qos: 1,
        retain: true,
      }));
  } catch (error) {
    console.log(error);
  }
}

/**
 * @param packet
 */
function shouldIgnorePacket(packet) {
  return packet && packet.properties
  && packet.properties.userProperties
  && packet.properties.userProperties.ignorePacket;
}

/**
 * @param packet
 * @param client
 */
async function onPublish(packet, client) {
  if (shouldIgnorePacket(packet)) {
    return;
  }

  const [topic, field] = packet.topic.split('/');

  const forwardToTopic = await keyv.get(topic);

  if (forwardToTopic) {
    broker.publish({
      topic: `${forwardToTopic}/${field}`,
      payload: packet.payload,
      qos: 1,
      retain: true,
      properties: {
        userProperties: {
          ignorePacket: true,
        },
      },
    });
  }

  if (field === 'Score') {
    publishScoreTopics(topic, packet);
  }
}

module.exports = onPublish;
