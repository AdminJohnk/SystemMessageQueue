'use strict';

const { connectToRabbitMQ, closeConnection } = require('../dbs/init.rabbit');

class ConsumerService {
  static async consumerQueue(queueName) {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      await channel.assertQueue(queueName, { durable: true });
      console.log(`Waiting for messages in ${queueName}...`);
      channel.consume(
        queueName,
        message => {
        //   console.log(
        //     `Received message: ${queueName}:: ${message.content.toString()}`
        //   );

        // 1. find User following 
        // 2. send message to User following
        // 3. yes, ok ===> success
        // 4. error, setup DLX ...

        },
        { noAck: true }
      );

    } catch (error) {
      console.error(`Error consuming queue::`, error);
      throw error;
    }
  }
}

module.exports = ConsumerService;
