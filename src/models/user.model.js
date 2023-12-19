'use strict';

const { model, Schema, Types } = require('mongoose');
const { unGetSelectData, getSelectData } = require('../utils/functions');
const { avt_default, se_UserDefault } = require('../utils/constants');
const ObjectId = Types.ObjectId;
const { UserIncrClass } = require('./user_incr.model');

const DOCUMENT_NAME = 'User';
const COLLECTION_NAME = 'users';

var UserSchema = new Schema(
  {
    id_incr: { type: Number, default: 0 },
    name: {
      type: String,
      trim: true,
      maxLength: 150,
      required: true
    },
    email: {
      type: String,
      unique: true,
      trim: true,
      required: true
    },
    password: { type: String, required: true },
    role: Array,

    // ==================================================

    phone_number: Number,
    user_image: { type: String, default: avt_default },
    cover_image: String,
    verified: { type: Boolean, default: false },
    tags: [{ type: String }],
    alias: String,
    about: String,
    experiences: { type: Array, default: [] },
    /* 
      {
        positionName: String,
        companyName: String,
        startDate: String,
        endDate: String
      }
    */
    repositories: { type: Array, default: [] },
    /* 
    {
        id: Number,
        name: String,
        private: Boolean,
        url: String,
        watchersCount: Number,
        forksCount: Number,
        stargazersCount: Number,
        languages: String
      }
    */
    contacts: { type: Array, default: [] },
    location: String,
    favorites: {
      type: [{ type: ObjectId, ref: 'Post' }],
      default: []
    },
    communities: {
      type: [{ type: ObjectId, ref: 'Community' }],
      default: []
    },
    notifications: {
      type: [{ type: ObjectId, ref: 'Notification' }],
      default: []
    },

    // Number behavior
    follower_number: { type: Number, default: 0 },
    following_number: { type: Number, default: 0 },
    post_number: { type: Number, default: 0 }
  },
  {
    timestamps: true,
    collection: COLLECTION_NAME
  }
);

UserSchema.pre('save', async function (next) {
  const userIncr = await UserIncrClass.getIdCurrent();
  if (userIncr.id_delete.length) {
    this.id_incr = userIncr.id_delete.at(-1);
    await UserIncrClass.pullIdDelete();
  } else {
    this.id_incr = userIncr.id_current + 1;
    await UserIncrClass.setIncrId(this.id_incr);
  }

  next();
});

const UserModel = model(DOCUMENT_NAME, UserSchema);

class UserClass {
  static async checkExist(select) {
    return await UserModel.findOne(select).lean();
  }
}

//Export the model
module.exports = {
  UserClass,
  UserModel
};
