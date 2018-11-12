import { ObjectId } from 'mongodb';

import Reading from '../../src/models/Reading';

const COLLECTION_READINGS = 'readings';
const mockDeleteOne = jest.fn();
const mockSort = jest.fn();
const mockLimit = jest.fn().mockReturnValue({ sort: mockSort });
const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
const mockFind = jest.fn().mockReturnValue({ skip: mockSkip });
const mockCollection = jest.fn().mockReturnValue({ deleteOne: mockDeleteOne, find: mockFind });
// jest.mock('mongodb', () => ({ ObjectId: function ObjectId(id) }));
jest.mock('../../src/MongoDBHelper', () => ({
  promiseInsertResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  promiseFindResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
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
});
