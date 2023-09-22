'use strict';

const ConsumerService = require('./src/services/consumerQueue.service');
const queueName = 'test_queue';

const runConsumer = async () => {
  await ConsumerService.consumerQueue(queueName)
    .then(() => {
      console.log(`Message consumer started ${queueName}`);
    })
    .catch(err => {
      console.error(`Message Error: ${err.message}`);
    });

  await ConsumerService.consumerToQueueNormal(queueName)
    .then(() => {
      console.log(`Message consumerToQueueNormal started`);
    })
    .catch(err => {
      console.error(`Message Error: ${err.message}`);
    });

  await ConsumerService.consumerToQueueFailed(queueName)
    .then(() => {
      console.log(`Message consumerToQueueFailed started`);
    })
    .catch(err => {
      console.error(`Message Error: ${err.message}`);
    });

  console.log('=========================================\n\n');
};

runConsumer();
