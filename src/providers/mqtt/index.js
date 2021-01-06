const aedes = require('aedes');
const aedesPersistenceMongoDB = require('aedes-persistence-mongodb');
const ws = require('websocket-stream');
const brokerConfig = require('../../config/broker');
const authorizePublish = require('./authorizePublish');
const http = require('http');
const net = require('net');

const broker = aedes({
  persistence: aedesPersistenceMongoDB(
    {
      url: brokerConfig.persistenceUrl,
    },
  ),
});

broker.authorizePublish = authorizePublish;

const httpServer = http.createServer();

ws.createServer({
  server: httpServer,
}, broker.handle);

const server = net.createServer(broker.handle);

/**
 *
 */
async function listen() {
  httpServer.listen(brokerConfig.wsPort, () => {
    console.log('Aedes server (WebSocket) running');
  });

  server.listen(brokerConfig.standalonePort, () => {
    console.log('Aedes server (Standalone) running');
  });
}

module.exports = { broker, listen };
