import { ObjectId } from 'mongodb';

import User from '../../src/models/User';

const COLLECTION_USER = 'users';

const mockLimit = jest.fn();
const mockCount = jest.fn();
const mockFindOneAndUpdate = jest.fn();
const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
const mockFind = jest.fn().mockReturnValue({ skip: mockSkip });
const mockCollection = jest.fn().mockReturnValue({
  find: mockFind, count: mockCount, findOneAndUpdate: mockFindOneAndUpdate,
});
jest.mock('../../src/MongoDBHelper', () => ({
  promiseFindResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  promiseReturnResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  promiseNextResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  getDB: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      findOne: jest.fn().mockReturnValue({
        then: jest.fn().mockImplementation(callback => callback('result', null)),
      }),
    }),
  }),
}));

describe('fetchAllUserList', () => {
  test('fetchALlUserList', () => {
    const { promiseFindResult } = require('../../src/MongoDBHelper');
    User.fetchAllUserList({ pageNumber: '10', numberPerpage: '5' });

    expect(promiseFindResult).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_USER);
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenLastCalledWith({}, {
      displayName: 1, photo: 1, role: 1, 'settings.customName': 1,
    });
    expect(mockSkip).toHaveBeenCalledTimes(1);
    expect(mockSkip).toHaveBeenLastCalledWith(50);
    expect(mockLimit).toHaveBeenCalledTimes(1);
    expect(mockLimit).toHaveBeenLastCalledWith(5);
  });

  test('fetchUsersAmount', () => {
    const { promiseReturnResult } = require('../../src/MongoDBHelper');
    User.fetchUsersAmount();

    expect(promiseReturnResult).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledTimes(2);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_USER);
    expect(mockCount).toHaveBeenCalledTimes(1);
    expect(mockCount).toHaveBeenLastCalledWith({});
  });

  test('isUserNameAvailable', () => {
    const { promiseNextResult } = require('../../src/MongoDBHelper');
    User.isUserNameAvailable({ userName: 'username' });

    expect(promiseNextResult).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledTimes(3);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_USER);
    expect(mockFind).toHaveBeenCalledTimes(2);
    expect(mockFind).toHaveBeenLastCalledWith({ username: 'username' });
  });

  test('fetchOneUser', async () => {
    const { getDB } = require('../../src/MongoDBHelper');
    await expect(User.fetchOneUser('5b182e9138dbb7258cc39546')).resolves.toEqual('result');
    // await User.fetchOneUser('5b182e9138dbb7258cc39546');

    expect(getDB).toHaveBeenCalledTimes(1);
    expect(getDB().collection).toHaveBeenCalledTimes(1);
    expect(getDB().collection).toHaveBeenLastCalledWith(COLLECTION_USER);
    expect(getDB().collection().findOne).toHaveBeenCalledTimes(1);
    expect(getDB().collection().findOne).toHaveBeenLastCalledWith(
      { _id: new ObjectId('5b182e9138dbb7258cc39546') },
      {
        pushSubscriptions: 0, facebookId: 0, googleId: 0, email: 0,
      },
    );
    expect(getDB().collection().findOne().then).toHaveBeenCalledTimes(1);
  });

  test('fetchOneUser with error', async () => {
    const { getDB } = require('../../src/MongoDBHelper');
    getDB.mockReturnValueOnce({
      collection: jest.fn().mockReturnValue({
        findOne: jest.fn().mockReturnValue({
          then: jest.fn().mockImplementation(callback => callback('result', true)),
        }),
      }),
    });

    await expect(User.fetchOneUser('5b182e9138dbb7258cc39546')).rejects.toEqual(true);
  });

  test('fetchUsersPushSubscriptions', async () => {
    const { promiseFindResult } = require('../../src/MongoDBHelper');
    await User.fetchUsersPushSubscriptions(['5b182e9138dbb7258cc39546', '5b182e9138dbb7258cc39547']);

    expect(promiseFindResult).toHaveBeenCalledTimes(2);
    expect(mockCollection).toHaveBeenCalledTimes(4);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_USER);
    expect(mockFind).toHaveBeenCalledTimes(3);
    expect(mockFind).toHaveBeenLastCalledWith(
      {
        _id: { $in: [new ObjectId('5b182e9138dbb7258cc39546'), new ObjectId('5b182e9138dbb7258cc39547')] },
        'settings.isPushNotification': true,
      },
      {
        _id: 0,
        pushSubscriptions: 1,
      },
    );
  });

  test('updateUser', () => {
    const { promiseReturnResult } = require('../../src/MongoDBHelper');
    User.updateUser('5b182e9138dbb7258cc39546', 'user', 'removeFields');

    expect(promiseReturnResult).toHaveBeenCalledTimes(2);
    expect(mockCollection).toHaveBeenCalledTimes(5);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_USER);
    expect(mockFindOneAndUpdate).toHaveBeenCalledTimes(1);
    expect(mockFindOneAndUpdate).toHaveBeenLastCalledWith(
      { _id: new ObjectId('5b182e9138dbb7258cc39546') },
      { $set: 'user', $unset: 'removeFields' },
      { returnOriginal: false, projection: { pushSubscription: 0 } },
    );
  });

  test('updateUser without removeFields', () => {
    const { promiseReturnResult } = require('../../src/MongoDBHelper');
    User.updateUser('5b182e9138dbb7258cc39546', 'user', null);

    expect(mockFindOneAndUpdate).toHaveBeenLastCalledWith(
      { _id: new ObjectId('5b182e9138dbb7258cc39546') },
      { $set: 'user' },
      { returnOriginal: false, projection: { pushSubscription: 0 } },
    );
  });
});
