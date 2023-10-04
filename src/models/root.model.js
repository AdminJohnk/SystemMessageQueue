const { FollowClass } = require('./follow.model');
const { LikeClass } = require('./like.model');
const { NotiClass } = require('./notification.model');
const { ChildCommentClass } = require('./childComment.model');
const { ParentCommentClass } = require('./parentComment.model');
const { PostClass } = require('./post.model');
const { UserIncrClass } = require('./user_incr.model');
const { UserClass } = require('./user.model');

const arrayClass = [
  FollowClass,
  LikeClass,
  NotiClass,
  ChildCommentClass,
  ParentCommentClass,
  PostClass,
  UserIncrClass,
  UserClass
];

module.exports = {
  arrayClass
};
