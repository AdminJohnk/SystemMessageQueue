const { connectToRabbitMQ } = require('../database/init.rabbit');
const {
  NotificationService,
  numQueue_NotiService
} = require('./notification.service');
const { UserIncrClass } = require('../models/user_incr.model');

// in ra màn hình khi nhận message được gửi lên từ server chính
const consoleMsg = msg => {
  const message = JSON.parse(msg.content.toString());
  // console.log(`Message: `, message);
  const createAt = new Date(message.createAt).toLocaleString('en-GB', {
    timeZone: 'Asia/Ho_Chi_Minh'
  });
  // console.log(`createAt: `, createAt, '\n\n');
  return { message };
};

const notificationExchange = 'notificationEx';
const notiQueue = 'notificationQueueProcess';

const notificationExchangeDLX = 'notificationExDLX';
const notificationRoutingKeyDLX = 'notificationRoutingKeyDLX';

const notiQueueCommon = 'notificationQueueCommon';

const delay = ms =>
  new Promise(resolve => {
    setTimeout(resolve, ms);
  });

class ConsumerNotiService {
  queueNameArr = [];
  channel;
  connection;

  static async connectRabbitMQ() {
    const { channel, connection } = await connectToRabbitMQ();
    this.channel = channel;
    this.connection = connection;
  }

  static async consumeNotify() {
    try {
      const channel = this.channel;
      // 1. create Exchange
      await channel.assertExchange(notificationExchange, 'direct', {
        durable: true
      });

      // 2. create Queue
      // Lỗi ở NotiQueue --> chuyển đến queue liên kết với Exchange DLX và RoutingKey DLX
      const queueResult = await channel.assertQueue(notiQueue, {
        exclusive: false, // cho phép các kết nối khác truy cập đến cùng một hàng đợi
        durable: true,
        deadLetterExchange: notificationExchangeDLX,
        deadLetterRoutingKey: notificationRoutingKeyDLX
      });

      // 3. bindQueue
      await channel.bindQueue(queueResult.queue, notificationExchange);
      // 4. consume Queue
      channel.consume(notiQueue, async msg => {
        try {
          // Nghiệp vụ logic
          const message = JSON.parse(msg.content.toString());
          // console.log('Message: ', message);
          await NotificationService.handleNotify({ message });
          channel.ack(msg);
        } catch (error) {
          console.error(error);
          channel.nack(msg, false, false);
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  // Tạo thêm queue để phân phối thông báo
  static async consumeDistributeNotify() {
    try {
      const channel = this.channel;
      channel.prefetch(1000);
      const userIncr = await UserIncrClass.getIdCurrent();

      // Tạo queueNameArr theo đáp ứng cho số id_incr
      const queueNameArr = [];
      const numQueue = Math.ceil(userIncr.id_current / 1000);
      numQueue_NotiService[0] = numQueue;

      for (let i = 1; i <= numQueue; i++) {
        queueNameArr.push(`notificationQueue${i}`);
      }
      queueNameArr.push(notiQueueCommon);
      this.queueNameArr = queueNameArr;

      queueNameArr.map(async queue => {
        // 1. create Queue
        const queueResult = await channel.assertQueue(queue, {
          exclusive: false,
          durable: true,
          deadLetterExchange: notificationExchangeDLX,
          deadLetterRoutingKey: notificationRoutingKeyDLX
        });
        // 2. bind Queue
        await channel.bindQueue(queueResult.queue, notificationExchange);

        const checkConsumerExist = await channel.checkQueue(queue);

        // 3. consume Queue
        if (!checkConsumerExist.consumerCount) {
          await channel.consume(
            queue,
            async msg => {
              try {
                const message = JSON.parse(msg.content.toString());
                console.log(`Create from queue: ${queue}`);
                console.log(`Message: `, message);

                await NotificationService.handleNotify({ message });
                await delay(5000);
                channel.ack(msg);
              } catch (error) {
                console.error(error);
                channel.nack(msg, false, false);
              }
            }
          );
        }
      });
    } catch (error) {
      console.error(error);
    }
  }
  static async consumeNotifyFailed() {
    try {
      const channel = this.channel;

      const notiQueueHandler = 'notificationQueueHotFix';
      // 1. create Exchange
      await channel.assertExchange(notificationExchangeDLX, 'direct', {
        durable: true
      });

      // 2. create Queue riêng của DLX Exchange
      const queueResult = await channel.assertQueue(notiQueueHandler, {
        durable: true,
        exclusive: false
      });

      // 3. bindQueue
      await channel.bindQueue(
        queueResult.queue,
        notificationExchangeDLX,
        notificationRoutingKeyDLX
      );

      channel.get(queueResult.queue, { noAck: true });

      await channel.consume(
        queueResult.queue,
        async msg => {
          // Nghiệp vụ logic
          console.log('Notification Queue Hot Fix');
          const message = JSON.parse(msg.content.toString());
          console.log('Message: ', message);
          await NotificationService.handleNotify({ message });
        },
        { noAck: true }
      );
    } catch (error) {
      console.error(error);
      throw error;
    }
  }
  static async runNotificationConsumer() {
    await this.connectRabbitMQ();
    await this.consumeNotify()
      .then(() => {
        console.log(`ConsumeNotify started`);
      })
      .catch(err => {
        console.error(`Message Error: ${err.message}`);
      });
    await this.consumeNotifyFailed()
      .then(() => {
        console.log(`ConsumeNotifyFailed started`);
      })
      .catch(err => {
        console.error(`Message Error: ${err.message}`);
      });
    await this.consumeDistributeNotify()
      .then(() => {
        console.log(`ConsumeDistributeNotify started`);
      })
      .catch(err => {
        console.error(`Message Error: ${err.message}`);
      });

    setInterval(async () => {
      await this.consumeDistributeNotify();
    }, 600000);

    console.log('=========================================\n\n');
  }
}

module.exports = ConsumerNotiService;
