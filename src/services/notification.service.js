const { NotiClass } = require('../models/notification.model');
const { FriendClass } = require('../models/friend.model');
const { Notification } = require('../utils/notificationType');
const { connectToRabbitMQ } = require('../database/init.rabbit');
const { CREATEPOST_001 } = Notification;

const notiQueueCommon = 'notificationQueueCommon';

let numQueue_NotiService = [];

class NotificationService {
  static async handleNotify({ message }) {
    if (message.kind === 'one_to_one') {
      await NotiClass.createNotify(message);
    } else if (message.kind === 'one_to_many') {
      if (message.type === CREATEPOST_001.type) {
        // const { channel, connection } = await connectToRabbitMQ();
        // const msgForqueue1 = [];
        // const msgForqueue2 = [];

        // for (let i = 1; i <= 10; i++) {
        //   const msg = {
        //     ...message,
        //     kind: 'one_to_one',
        //     receiver: '65143a4b4d4280e1868fb6de',
        //     id_incr: i
        //   };

        //   msgForqueue1.push(msg);
        // }

        // for (let i = 1001; i <= 1010; i++) {
        //   const msg = {
        //     ...message,
        //     kind: 'one_to_one',
        //     receiver: '64fac9b2545bc6a41973744c',
        //     id_incr: i
        //   };

        //   msgForqueue2.push(msg);
        // }

        // let messages = msgForqueue1.concat(msgForqueue2);

        // messages.forEach(async message => {
        //   // 1. create QueueName
        //   const queueNumber = Math.ceil(message.id_incr / 1000);
        //   let queueName = `notificationQueue${queueNumber}`;
        //   if (queueNumber > numQueue_NotiService[0])
        //     queueName = notiQueueCommon;

        //   // 2. send message to queue
        //   channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
        //     persistent: true,
        //     expiration: '600000',

        //   });
        // });

        // setTimeout(() => {
        //   connection.close();
        // }, 500);

        // ===============================================

        const { channel, connection } = await connectToRabbitMQ();

        const friends = await FriendClass.getAllFriends({
          user_id: message.sender
        });
        if (!friends) return null;

        // Tạo mảng message thông báo tới các followers
        const messages = friends.map((friend) => ({
          ...message,
          kind: 'one_to_one',
          receiver: friend._id,
          id_incr: friend.id_incr
        }));

        messages.forEach(async (message) => {
          // 1. create QueueName
          const queueNumber = Math.ceil(message.id_incr / 1000);
          let queueName = `notificationQueue${queueNumber}`;
          if (queueNumber > numQueue_NotiService[0]) queueName = notiQueueCommon;

          // 2. send message to queue
          channel.sendToQueue(queueName, Buffer.from(JSON.stringify(message)), {
            persistent: true,
            expiration: '600000'
          });
        });

        setTimeout(() => {
          connection.close();
        }, 500);
      }
    }
  }
}

module.exports = {
  NotificationService,
  numQueue_NotiService
};
