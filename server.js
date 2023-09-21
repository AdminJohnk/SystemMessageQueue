'use strict';

const ConsumerService = require('./src/services/consumerQueue.service');
const queueName = 'test_queue';

ConsumerService.consumerQueue(queueName)
  .then(() => {
    console.log(`Message consumer started ${queueName}`);
  })
  .catch(err => {
    console.error(`Message Error: ${err.message}`);
  });
