import fetchAllReadingListController from '../../src/controllers/FetchAllReadingList';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/Reading', () => ({ fetchAllReadingList: jest.fn().mockReturnValue(Promise.resolve({ result: 'result' })) }));

describe('GetJournal', () => {
  test('fetchAllReadingList without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = { query: { jwt: 'message', numberPerpage: 20, pageNumber: 1 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchAllReadingList } = require('../../src/models/Reading');

    await fetchAllReadingListController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(1);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchAllReadingList).toHaveBeenCalledTimes(1);
    expect(fetchAllReadingList).toHaveBeenLastCalledWith({ userId: 'id', pageNumber: 1, numberPerpage: 20 });
    expect(mockJsonFn).toHaveBeenLastCalledWith({ result: 'result' });
  });

  test('fetchAllReadingList with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = { query: { jwt: 'message', numberPerpage: 20, pageNumber: 1 } };
    const verifyJWT = require('../../src/utils/VerifyJWT');
    const { fetchAllReadingList } = require('../../src/models/Reading');
    fetchAllReadingList.mockReturnValue(Promise.reject());

    await fetchAllReadingListController(req, res);

    expect(verifyJWT).toHaveBeenCalledTimes(2);
    expect(verifyJWT).toHaveBeenLastCalledWith({ message: 'message', res });
    expect(fetchAllReadingList).toHaveBeenCalledTimes(2);
    expect(fetchAllReadingList).toHaveBeenLastCalledWith({ userId: 'id', pageNumber: 1, numberPerpage: 20 });
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
