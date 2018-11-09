import { ObjectId } from 'mongodb';

import Journal from '../../src/models/Journal';

const mockDeleteOne = jest.fn();
const mockCollection = jest.fn().mockReturnValue({ deleteOne: mockDeleteOne });
jest.mock('../../src/MongoDBHelper', () => ({
  promiseInsertResult: jest.fn().mockImplementation(callback => callback({
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
});
