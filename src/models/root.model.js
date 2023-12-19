const { FriendClass } = require('./friend.model');
const { NotiClass } = require('./notification.model');
const { UserIncrClass } = require('./user_incr.model');
const { UserClass } = require('./user.model');

const arrayClass = [FriendClass, NotiClass, UserIncrClass, UserClass];

module.exports = {
  arrayClass
};
