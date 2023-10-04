'use strict';

const ConsumerNotiService = require('../services/consumerNotification.service');

class ConsumerService {
  static async runNotificationConsumer() {
    await ConsumerNotiService.runNotificationConsumer();
  }
}

module.exports = ConsumerService;
