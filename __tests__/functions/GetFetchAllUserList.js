import getFetchAllUserList from '../../src/routers/functions/GetFetchAllUserList';

jest.mock('../../src/utils/Logger', () => ({ error: jest.fn() }));
jest.mock('../../src/utils/VerifyJWT', () => jest.fn().mockReturnValue({ _id: 'id', role: 1 }));
jest.mock('../../src/MongoDB', () => ({ fetchAllUserList: jest.fn().mockReturnValue(Promise.resolve({ id: 'resultId' })) }));

describe('GetFetchAllUserList', () => {
  test('fetchAllUserList without error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = {};
    const { fetchAllUserList } = require('../../src/MongoDB');

    await getFetchAllUserList(req, res);
    expect(fetchAllUserList).toHaveBeenCalledTimes(1);
    expect(mockJsonFn).toHaveBeenLastCalledWith({ id: 'resultId' });
  });

  test('fetchAllUserList with error', async () => {
    const mockJsonFn = jest.fn();
    const res = { json: mockJsonFn };
    const req = {};
    const { fetchAllUserList } = require('../../src/MongoDB');
    fetchAllUserList.mockReturnValue(Promise.reject());
    const { error } = require('../../src/utils/Logger');

    await getFetchAllUserList(req, res);
    expect(fetchAllUserList).toHaveBeenCalledTimes(2);
    expect(mockJsonFn).not.toHaveBeenCalled();
    expect(error).toHaveBeenCalledTimes(1);
  });
});
