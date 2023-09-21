'use strict';

const amqp = require('amqplib');

const connectToRabbitMQ = async () => {
  try {
    const connection = await amqp.connect('amqp://localhost');
    if (!connection) throw new Error('Connection not established');

    const channel = await connection.createChannel();

    return { channel, connection };
  } catch (error) {
    console.log(error);
    throw error;
  }
};

const connectToRabbitMQForTest = async () => {
  try {
    const { channel, connection } = await connectToRabbitMQ();

    // Publish message to a queue
    const queue = 'test-queue';
    const message = 'Hello, shopDEV by anonystick';
    await channel.assertQueue(queue);
    await channel.sendToQueue(queue, Buffer.from(message));

    // close the connection
    await connection.close();
  } catch (error) {
    console.log('Error connecting to RabbitMQ', error);
    throw error;
  }
};

const closeConnection = connection => {
  try {
    setTimeout(() => {
      connection.close();
      process.exit(0);
    }, 500);
  } catch (error) {
    console.log('Error closing RabbitMQ connection', error);
    throw error;
  }
};

module.exports = {
  connectToRabbitMQ,
  connectToRabbitMQForTest,
  closeConnection
};
