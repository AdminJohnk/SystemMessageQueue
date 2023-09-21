'use strict';

const mongoose = require('mongoose');
const connectString =
  'mongodb+srv://socialnetwork:IsBSBM6L1CFiiQWL@socialcluster.i599n1a.mongodb.net/SocialProDEV';

const TestSchema = new mongoose.Schema({ name: String });
const Test = mongoose.model('Test', TestSchema);

describe('Mongoose Connection', () => {
  let connection;

  beforeAll(async () => {
    connection = await mongoose.connect(connectString);
  });

  // Close the connection to mongoose
  afterAll(async () => {
    await connection.disconnect();
  });

  it('should connect to mongoose', () => {
    expect(mongoose.connection.readyState).toBe(1);
  });

  it('should save a document to the database', async () => {
    const user = new Test({ name: 'Anonystick' });
    await user.save();
    expect(user.isNew).toBe(false); // true: chưa lưu, false: đã lưu
  });

  it('should find a document from the database', async () => {
    const user = await Test.findOne({ name: 'Anonystick' });
    expect(user).toBeDefined();
    expect(user.name).toBe('Anonystick');
  });
});
