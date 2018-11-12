import User from '../../src/models/User';

const COLLECTION_USER = 'users';

const mockLimit = jest.fn();
const mockSkip = jest.fn().mockReturnValue({ limit: mockLimit });
const mockFind = jest.fn().mockReturnValue({ skip: mockSkip });
const mockCollection = jest.fn().mockReturnValue({ find: mockFind });
jest.mock('../../src/MongoDBHelper', () => ({
  promiseFindResult: jest.fn().mockImplementation(callback => callback({
    collection: mockCollection,
  })),
}));

describe('fetchAllUserList', () => {
  test('fetchALlUserList', () => {
    User.fetchAllUserList({ pageNumber: '10', numberPerpage: '5' });

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
});
