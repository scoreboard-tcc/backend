/* eslint-disable camelcase */
const container = require('../../container');
const keyv = require('../keyv');

const broker = container.resolve('broker');
const addScoreUseCase = container.resolve('addScoreUseCase');

/**
 * @param topic
 * @param fieldMap
 */
async function publishScoreTopics(topic, fieldMap) {
  Object.entries(fieldMap)
    .filter(([t]) => !['Who_Scored', 'Who_Scored_Name', 'Score_Type'].includes(t))
    .forEach(([field, value]) => broker.publish({
      topic: `${topic}/${field}`,
      payload: Buffer.from(value),
      qos: 1,
      retain: true,
    }));
}

/**
 * @param topic
 * @param packet
 */
async function processScorePacket(topic, packet) {
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
      Who_Scored,
      Who_Scored_Name,
      Score_Type,
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
      Who_Scored,
      Who_Scored_Name,
      Score_Type,
    };

    publishScoreTopics(topic, fieldMap);
    addScoreUseCase.execute(topic, fieldMap);
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
 */
async function onPublish(packet) {
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
    processScorePacket(topic, packet);
  }
}

module.exports = onPublish;
