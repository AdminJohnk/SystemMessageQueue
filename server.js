'use strict';

require('dotenv').config();
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
