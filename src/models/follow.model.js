'use strict';

const { model, Schema, Types, get } = require('mongoose');
const { getSelectData } = require('../utils/functions');
const { se_UserDefault } = require('../utils/constants');

const ObjectId = Types.ObjectId;

const DOCUMENT_NAME = 'Follow';
const COLLECTION_NAME = 'follows';

// user_id follower_ids following_ids

var FollowSchema = new Schema(
  {
    user: { type: ObjectId, ref: 'User' },
    followers: {
      type: [{ type: ObjectId, ref: 'User', default: [] }]
    },
    followings: {
      type: [{ type: ObjectId, ref: 'User', default: [] }]
    }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

const FollowModel = model(DOCUMENT_NAME, FollowSchema);

class FollowClass {
  static async getListFollowersByUserId({ user }) {
    const result =  await FollowModel.findOne({ user })
      .select('followers -_id')
      .populate('followers', '_id id_incr');

    return result.followers;
  }
  static async checkExist(select) {
    return await FollowModel.findOne(select).lean();
  }
}


//Export the model
module.exports = {
  FollowClass,
  FollowModel
};
