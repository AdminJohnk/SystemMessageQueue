'use strict';

const { model, Schema, Types } = require('mongoose');
const { pp_UserDefault } = require('../utils/constants');
const ObjectId = Types.ObjectId;

const DOCUMENT_NAME = 'Like';
const COLLECTION_NAME = 'likes';

var LikeSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User', required: true },
    post: { type: ObjectId, ref: 'Post', required: true },
    owner_post: { type: ObjectId, ref: 'User', required: true }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

const LikeModel = model(DOCUMENT_NAME, LikeSchema);

class LikeClass {
  static async checkExist(select) {
    return await LikeModel.findOne(select).lean();
  }
}

//Export the model
module.exports = {
  LikeClass,
  LikeModel
};
