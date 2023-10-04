'use strict';

const { model, Schema, Types } = require('mongoose');
const { getSelectData, unGetSelectData } = require('../utils/functions');
const {
  pp_UserDefault,
  se_UserDefault,
  unSe_PostDefault,
  se_UserDefaultForPost
} = require('../utils/constants');
const ObjectId = Types.ObjectId;


const DOCUMENT_NAME = 'Post';
const COLLECTION_NAME = 'posts';

var PostSchema = new Schema(
  {
    type: { type: String, enum: ['Post', 'Share'], required: true },
    post_attributes: {
      // type = Post
      user: { type: ObjectId, ref: 'User' }, // me_id
      title: String,
      content: String,
      url: String,
      img: String,

      // type = Share
      user: { type: ObjectId, ref: 'User' }, // me_id
      post: { type: ObjectId, ref: 'Post' },
      owner_post: { type: ObjectId, ref: 'User' },

      // common field
      view_number: { type: Number, default: 0 },
      like_number: { type: Number, default: 0 },
      save_number: { type: Number, default: 0 },
      share_number: { type: Number, default: 0 },
      comment_number: { type: Number, default: 0 },

      likes: {
        type: [{ type: ObjectId, ref: 'User' }],
        select: false
      },
      shares: {
        type: [{ type: ObjectId, ref: 'User' }],
        select: false
      },
      saves: {
        type: [{ type: ObjectId, ref: 'User' }],
        select: false
      }
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

const PostModel = model(DOCUMENT_NAME, PostSchema);

class PostClass {
  static async checkExist(select) {
    return await PostModel.findOne(select).lean();
  }
}

//Export the model
module.exports = {
  PostClass,
  PostModel
};
