import sinon from 'sinon';
import { ObjectId } from 'mongodb';

import Journal from '../../src/models/Journal';

const mockDeleteOne = jest.fn();
const mockFind = jest.fn();
const mockInsert = jest.fn();
const mockCollection = jest.fn().mockReturnValue({
  deleteOne: mockDeleteOne, find: mockFind, insert: mockInsert,
});
jest.mock('../../src/MongoDBHelper', () => ({
  promiseInsertResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  promiseNextResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
  promiseFindResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
}));

describe('Journal Model', () => {
  test('deleteUnattachedJournal', () => {
    const { promiseInsertResult } = require('../../src/MongoDBHelper');
    Journal.deleteUnattachedJournal({ journalId: '5b182e9138dbb7258cc39547', userId: 'userId' });

    expect(promiseInsertResult).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenLastCalledWith('journal_entries');
    expect(mockDeleteOne).toHaveBeenCalledTimes(1);
    expect(mockDeleteOne).toHaveBeenLastCalledWith({ _id: new ObjectId('5b182e9138dbb7258cc39547'), user_id: 'userId' });
  });

  test('fetchUnattachedJournal', () => {
    const { promiseNextResult } = require('../../src/MongoDBHelper');
    Journal.fetchUnattachedJournal({ journalId: '5b182e9138dbb7258cc39547', userId: 'userId' });

    expect(promiseNextResult).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledTimes(2);
    expect(mockCollection).toHaveBeenLastCalledWith('journal_entries');
    expect(mockFind).toHaveBeenCalledTimes(1);
    expect(mockFind).toHaveBeenLastCalledWith({ _id: new ObjectId('5b182e9138dbb7258cc39547'), user_id: 'userId' });
  });

  test('fetchUnattachedJournalList', () => {
    const { promiseFindResult } = require('../../src/MongoDBHelper');
    Journal.fetchUnattachedJournalList('userId');

    expect(promiseFindResult).toHaveBeenCalledTimes(1);
    expect(mockCollection).toHaveBeenCalledTimes(3);
    expect(mockCollection).toHaveBeenLastCalledWith('journal_entries');
    expect(mockFind).toHaveBeenCalledTimes(2);
    expect(mockFind).toHaveBeenLastCalledWith({ user_id: 'userId' });
  });

  test('createJournal', () => {
    // const timer = sinon.useFakeTimers();
    const { promiseInsertResult } = require('../../src/MongoDBHelper');
    Journal.createJournal({ journal: 'journal', readings: [], date: '2018/03/16' });

    expect(promiseInsertResult).toHaveBeenCalledTimes(2);
    expect(mockCollection).toHaveBeenCalledTimes(4);
    expect(mockCollection).toHaveBeenLastCalledWith('journal_entries');
    expect(mockInsert).toHaveBeenCalledTimes(1);
    // expect(mockInsert).lastCalledWith.length.toBe(3);
    // .toHaveBeenLastCalledWith({
    //   journal: 'journal',
    //   _id: new ObjectId(),
    //   date: new Date('2018/03/16'),
    // });
    // timer.restore();
  });
});
