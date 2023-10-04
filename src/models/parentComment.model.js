'use strict';
const { model, Schema, Types } = require('mongoose');
const { getSelectData } = require('../utils/functions');
const ObjectId = Types.ObjectId;
const { pp_UserDefault } = require('../utils/constants');

const DOCUMENT_NAME = 'ParentComment';
const COLLECTION_NAME = 'parentComments';

const ParentCommentSchema = new Schema(
  {
    post: { type: ObjectId, ref: 'Product', required: true },
    user: { type: ObjectId, ref: 'User', required: true },
    content: { type: String, default: 'text', required: true },
    type: { type: String, default: 'parent' },

    // Like
    likes: { type: [{ type: ObjectId, ref: 'User' }], default: [] },
    like_number: { type: Number, default: 0 },
    dislike_number: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

const ParentCommentModel = model(DOCUMENT_NAME, ParentCommentSchema);

class ParentCommentClass {
  static async checkExist(select) {
    return await ParentCommentModel.findOne(select).lean();
  }
}

module.exports = {
  ParentCommentClass,
  ParentCommentModel
};
