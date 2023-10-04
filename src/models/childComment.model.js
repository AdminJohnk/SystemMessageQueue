'use strict';
const { model, Schema, Types } = require('mongoose');
const { getSelectData } = require('../utils/functions');
const { pp_UserDefault } = require('../utils/constants');
const ObjectId = Types.ObjectId;

const DOCUMENT_NAME = 'ChildComment';
const COLLECTION_NAME = 'childComments';

const ChildCommentSchema = new Schema(
  {
    post: { type: ObjectId, ref: 'Product', required: true },
    user: { type: ObjectId, ref: 'User', required: true },
    content: { type: String, default: 'text', required: true },
    parent: { type: ObjectId, ref: 'ParentComment', required: true },
    type: { type: String, default: 'child' },

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

const ChildCommentModel = model(DOCUMENT_NAME, ChildCommentSchema);

class ChildCommentClass {
  static async checkExist(select) {
    return await ChildCommentModel.findOne(select).lean();
  }
}

module.exports = {
  ChildCommentClass,
  ChildCommentModel
};
