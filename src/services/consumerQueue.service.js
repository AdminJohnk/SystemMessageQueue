'use strict';

const { connectToRabbitMQ, closeConnection } = require('../dbs/init.rabbit');

// const log = console.log;
// console.log = function () {
//   log.apply(console, [new Date().toISOString()].concat(arguments));
// };

class ConsumerService {
  static async consumerQueue(queueName) {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      await channel.assertQueue(queueName, { durable: true });
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
  // case processing
  static async consumerToQueueNormal(queueName) {
    try {
      const { channel, connection } = await connectToRabbitMQ();
      const notiQueue = 'notificationQueueProcess';

      // 1. TTL
    //   channel.consume(
    //     notiQueue,
    //     msg => {
    //       // Nghiệp vụ logic
    //       console.log(
    //         `SEND notificationQueue sucessfully processed:`,
    //         msg.content.toString()
    //       );
    //       channel.ack(msg);
    //     }
    //   );

      // 2. Logic Error
        channel.consume(notiQueue, msg => {
          try {
            const numberTest = Math.random();
            console.log({ numberTest });
            if (numberTest < 0.8) {
              throw new Error('Send notification failed:: HOT FIX');
            }

            console.log(
              `SEND notificationQueue sucessfully processed:`,
              msg.content.toString()
            );
            channel.ack(msg);
          } catch (error) {
            //   console.error('SEND notification error:', error);

            // false1: Không đẩy mes vào hàng đợi ban đầu, mà đẩy vào hàng đợi DLX
            // false2: có muốn xóa toàn bộ message khỏi hàng đợi hiện tại hay không
            channel.nack(msg, false, false);
          }
        });
    } catch (error) {
      console.error(error);
    }
  }
  // case failed processing
  static async consumerToQueueFailed(queueName) {
    try {
      const { channel, connection } = await connectToRabbitMQ();

      const notificationExchangeDLX = 'notificationExDLX'; // notificationEx direct
      const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX'; // assert

      const notiQueueHandler = 'notificationQueueHotFix';
      // 1. create Exchange
      await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true
      });

      // 2. create Queue riêng của DLX Exchange
      const queueResult = await channel.assertQueue(notiQueueHandler, {
        exclusive: false
      });

      // 3. bindQueue
      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );

      await channel.consume(
        queueResult.queue,
        msg => {
          // Nghiệp vụ logic
          console.log(
            `this notification error, pls hotfix:`,
            msg.content.toString()
          );
        },
        { noAck: true }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
}

module.exports = ConsumerService;
