import { ObjectId } from 'mongodb';

import Reading from '../../src/models/Reading';

const COLLECTION_READINGS = 'readings';
const mockDeleteOne = jest.fn();
const mockLimitB = jest.fn();
const mockSort = jest.fn().mockReturnValue({ limit: mockLimitB });
const mockLimit = jest.fn().mockReturnValue({ sort: mockSort });
const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
const mockFind = jest.fn().mockReturnValue({ skip: mockSkip, sort: mockSort });
const mockCount = jest.fn();
const mockReturnReading = [{
  _id: 'readingId', reading_name: 'readingName', journal_entries: [{ _id: new ObjectId('5b182e9138dbb7258cc39546') }],
}];
const mockCollection = jest.fn()
  .mockReturnValue({ deleteOne: mockDeleteOne, find: mockFind, count: mockCount });

jest.mock('../../src/MongoDBHelper', () => ({
  promiseInsertResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  promiseFindResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  promiseReturnResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  getDB: jest.fn().mockReturnValue({
    collection: jest.fn().mockReturnValue({
      find: jest.fn().mockReturnValue({
        toArray: jest.fn().mockImplementation(callback => callback(null, mockReturnReading)),
      }),
    }),
  }),
}));

describe('Reading Model', () => {
  test('Delete a reading', () => {
    const { promiseInsertResult } = require('../../src/MongoDBHelper');
    Reading.deleteReading({ readingId: '5b182e9138dbb7258cc39547', userId: '5b182e9138dbb7258cc39546' });

    expect(promiseInsertResult).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_READINGS);
    expect(mockDeleteOne).toHaveBeenCalledTimes(1);
    expect(mockDeleteOne).toHaveBeenLastCalledWith({ _id: new ObjectId('5b182e9138dbb7258cc39547'), user_id: '5b182e9138dbb7258cc39546' });
  });

  test('fetchAllReadingList', () => {
    const { promiseFindResult } = require('../../src/MongoDBHelper');
    Reading.fetchAllReadingList({ userId: 'userId', pageNumber: 10, numberPerpage: 5 });

    expect(mockCollection).toHaveBeenCalledTimes(2);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_READINGS);
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenLastCalledWith({ user_id: 'userId' }, { reading_name: 1, date: 1 });
    expect(mockSkip).toHaveBeenCalledTimes(1);
    expect(mockSkip).toHaveBeenLastCalledWith(50);
    expect(mockLimit).toHaveBeenCalledTimes(1);
    expect(mockLimit).toHaveBeenLastCalledWith(5);
    expect(mockSort).toHaveBeenCalledTimes(1);
    expect(mockSort).toHaveBeenLastCalledWith({ date: -1 });
  });

  test('fetchJournalList with user_id', () => {
    Reading.fetchJournalList({ readingId: '5b182e9138dbb7258cc39546', userId: '5b182e9138dbb7258cc39547' });

    expect(mockCollection).toHaveBeenCalledTimes(3);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_READINGS);
    expect(mockFind).toHaveBeenCalledTimes(2);
    expect(mockFind).toHaveBeenLastCalledWith({ _id: new ObjectId('5b182e9138dbb7258cc39546'), user_id: '5b182e9138dbb7258cc39547' }, { journal_entries: 1 });
  });

  test('fetchJournalList without user_id', () => {
    Reading.fetchJournalList({ readingId: '5b182e9138dbb7258cc39546' });

    expect(mockCollection).toHaveBeenCalledTimes(4);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_READINGS);
    expect(mockFind).toHaveBeenCalledTimes(3);
    expect(mockFind).toHaveBeenLastCalledWith({ _id: new ObjectId('5b182e9138dbb7258cc39546') }, { journal_entries: 1 });
  });

  test('fetchReadingsAmount', () => {
    Reading.fetchReadingsAmount('userId');

    expect(mockCollection).toHaveBeenCalledTimes(5);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_READINGS);
    expect(mockCount).toHaveBeenCalledTimes(1);
    expect(mockCount).toHaveBeenLastCalledWith({ user_id: 'userId' });
  });

  test('fetchReadingsBaseOnName', () => {
    Reading.fetchReadingsBaseOnName({ user_id: 'userId', keyWord: 'keyword' });

    expect(mockCollection).toHaveBeenCalledTimes(6);
    expect(mockCollection).toHaveBeenLastCalledWith(COLLECTION_READINGS);
    expect(mockFind).toHaveBeenCalledTimes(4);
    expect(mockFind).toHaveBeenLastCalledWith({ user_id: 'userId', reading_name: new RegExp('.*keyword.*', 'i') }, { _id: 1, reading_name: 1 });
    expect(mockSort).toHaveBeenCalledTimes(2);
    expect(mockSort).toHaveBeenLastCalledWith({ date: -1 });
    expect(mockLimitB).toHaveBeenCalledTimes(1);
    expect(mockLimitB).toHaveBeenLastCalledWith(10);
  });

  test('fetchJournal', async () => {
    const { getDB } = require('../../src/MongoDBHelper');
    const result = await Reading.fetchJournal({ journalId: '5b182e9138dbb7258cc39546', userId: 'userId' });

    expect(getDB).toHaveBeenCalledTimes(1);
    expect(getDB().collection).toHaveBeenCalledTimes(1);
    expect(getDB().collection).toHaveBeenLastCalledWith(COLLECTION_READINGS);
    expect(getDB().collection().find).toHaveBeenCalledTimes(1);
    expect(getDB().collection().find).toHaveBeenLastCalledWith(
      { user_id: 'userId', 'journal_entries._id': new ObjectId('5b182e9138dbb7258cc39546') },
      {
        _id: 1, reading_name: 1, user_id: 1, journal_entries: 1,
      },
    );
    expect(getDB().collection().find().toArray).toHaveBeenCalledTimes(1);
    expect(result).toEqual({
      user_id: 'userId',
      readingIds: { readingId: 'readingName' },
      _id: new ObjectId('5b182e9138dbb7258cc39546'),
    });
  });

  // test('fetchReadingsByHexagramId, with user id', async () => {
  //   const { getDB } = require('../../src/MongoDBHelper');
  //   await Reading.fetchReadingsByHexagramId('imageArray', 'userId');

  //   expect(getDB).toHaveBeenCalledTimes(1);
  //   expect(getDB().collection).toHaveBeenCalledTimes(1);
  //   expect(getDB().collection).toHaveBeenLastCalledWith(COLLECTION_READINGS);
  //   expect(getDB().collection().find).toHaveBeenCalledTimes(1);
  //   expect(getDB().collection().find).toHaveBeenLastCalledWith({
  //     $or: [{ hexagram_arr_1: 'imageArray' }, { hexagram_arr_2: 'imageArray' }],
  //     user_id: 'userId',
  //   });
  //   expect(getDB().collection().find().toArray).toHaveBeenCalledTimes(1);
  // });
});
