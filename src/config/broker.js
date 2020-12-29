module.exports = {
  persistenceUrl: process.env.BROKER_PERSISTENCE_URL,
  standalonePort: Number(process.env.BROKER_STANDALONE_PORT),
  wsPort: Number(process.env.BROKER_WS_PORT),
};
