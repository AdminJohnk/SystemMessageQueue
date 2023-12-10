'use strict';

require('dotenv').config();
const http = require('http');
const { connectToMongoDB } = require('./src/database/init.mongodb');
const ConsumerService = require('./src/services/consumerQueue.service');
const { arrayClass } = require('./src/models/root.model');

const runConsumer = async () => {
  await ConsumerService.runNotificationConsumer();
};

const runApp = async () => {
  await connectToMongoDB();
  await runConsumer();
};

runApp();

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Hello World!');
});

server.listen(process.env.PORT || 12345, () => {
  console.log(`Server running at http://localhost:${process.env.PORT || 12345}/`);
});
