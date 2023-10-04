const queueName = (id_incr) => {
//   return `notificationQueue${Math.ceil(id_incr / 1000)}`;
  return `notificationQueue${Math.ceil(id_incr)}`;
};

console.log(queueName(10));
