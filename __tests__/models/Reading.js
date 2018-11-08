import { ObjectId } from 'mongodb';

import Reading from '../../src/models/Reading';

const COLLECTION_READINGS = 'readings';
const mockDeleteOne = jest.fn();
const mockCollection = jest.fn().mockReturnValue({ deleteOne: mockDeleteOne });
// jest.mock('mongodb', () => ({ ObjectId: function ObjectId(id) }));
jest.mock('../../src/MongoDBHelper', () => ({
  promiseInsertResult: jest.fn().mockImplementation(callback => callback({
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
});
