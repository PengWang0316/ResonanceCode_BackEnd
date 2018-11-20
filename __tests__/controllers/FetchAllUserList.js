import fetchAllUserListController from '../../src/controllers/FetchAllUserList';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/models/User', () => ({ fetchAllUserList: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('FetchAllUserList', () => {
  test('fetchAllUserList without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = {};
    const { fetchAllUserList } = require('../../src/models/User');

    await fetchAllUserListController(req, res);
    expect(fetchAllUserList).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('fetchAllUserList with error', async () => {
    const mockJsonFn = jest.fn();
    const mockEnd = jest.fn();
    const res = { json: mockJsonFn, end: mockEnd };
    const req = {};
    const { fetchAllUserList } = require('../../src/models/User');
    fetchAllUserList.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await fetchAllUserListController(req, res);
    expect(fetchAllUserList).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
    expect(mockEnd).toHaveBeenCalledTimes(1);
  });
});
