'use strict';
const mongoose = require('mongoose');

const connectString =
  'mongodb+srv://socialnetwork:IsBSBM6L1CFiiQWL@socialcluster.i599n1a.mongodb.net/SocialProDEV';

const connectToMongoDB = async () => {
  await mongoose
    .connect(connectString, {
      maxPoolSize: 50
    })
    .then(() => {
      
      console.log('Connected to MongoDB\n');
    })
    .catch(err => {
      console.log('Error connecting to MongoDB');
      console.log(err);
    });
};

module.exports = {
  connectToMongoDB
};
